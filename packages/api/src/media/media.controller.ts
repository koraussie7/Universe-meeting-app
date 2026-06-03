import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('media')
export class MediaController {
  constructor(private s3: S3Service) {}

  /**
   * Server-side upload: receive file → buffer → S3
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { key, url } = await this.s3.upload(
      file.buffer,
      file.mimetype,
    );
    return { key, url, size: file.size };
  }

  /**
   * Get presigned upload URL (for client-side direct S3 upload)
   */
  @Get('upload-url')
  async getUploadUrl(
    @Query('contentType') contentType: string,
    @Query('prefix') prefix?: string,
  ) {
    return this.s3.getUploadPresignedUrl(contentType || 'image/jpeg', prefix);
  }

  /**
   * Get presigned download URL
   */
  @Get(':key')
  async getPresignedUrl(
    @Param('key') key: string,
    @Query('expires') expires?: string,
  ) {
    const url = await this.s3.getPresignedUrl(key, Number(expires) || 3600);
    return { url };
  }
}
