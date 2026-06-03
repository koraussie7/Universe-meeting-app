import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private config: ConfigService) {
    const endpoint = this.config.get<string>('S3_ENDPOINT', 'localhost:9000');
    const accessKey = this.config.get<string>('S3_ACCESS_KEY', 'minioadmin');
    const secretKey = this.config.get<string>('S3_SECRET_KEY', 'minioadmin');
    this.bucket = this.config.get<string>('S3_BUCKET', 'universe-media');

    this.client = new S3Client({
      endpoint: endpoint.startsWith('http') ? endpoint : `http://${endpoint}`,
      region: 'us-east-1',
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      forcePathStyle: true, // MinIO requires path-style
    });

    this.logger.log(`S3 configured: endpoint=${endpoint}, bucket=${this.bucket}`);
  }

  /**
   * Upload a file buffer to S3
   */
  async upload(
    buffer: Buffer,
    mimeType: string,
    prefix = 'uploads',
  ): Promise<{ key: string; url: string }> {
    const key = `${prefix}/${uuid()}`;
    const ext = this.mimeToExt(mimeType);
    const fullKey = key + ext;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fullKey,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    const endpoint = this.config.get<string>('S3_ENDPOINT', 'localhost:9000');
    const publicUrl = `http://${endpoint}/${this.bucket}/${fullKey}`;

    this.logger.log(`Uploaded: ${fullKey} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return { key: fullKey, url: publicUrl };
  }

  /**
   * Generate a presigned URL for reading (valid for `expiresIn` seconds)
   */
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Generate a presigned URL for uploading (client-side direct upload to S3)
   */
  async getUploadPresignedUrl(
    contentType: string,
    prefix = 'uploads',
    expiresIn = 300,
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const key = `${prefix}/${uuid()}${this.mimeToExt(contentType)}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn });

    const endpoint = this.config.get<string>('S3_ENDPOINT', 'localhost:9000');
    const publicUrl = `http://${endpoint}/${this.bucket}/${key}`;

    return { uploadUrl, key, publicUrl };
  }

  /**
   * Delete an object from S3
   */
  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  private mimeToExt(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/avif': '.avif',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/quicktime': '.mov',
    };
    return map[mimeType] || '';
  }
}
