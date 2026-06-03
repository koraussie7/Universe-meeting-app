import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { MediaController } from './media.controller';

@Module({
  providers: [S3Service],
  controllers: [MediaController],
  exports: [S3Service],
})
export class MediaModule {}
