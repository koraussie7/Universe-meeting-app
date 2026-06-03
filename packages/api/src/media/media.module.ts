import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: '/tmp/universe-uploads',
        filename: (_, file, cb) => {
          const name = uuid();
          cb(null, name + extname(file.originalname));
        },
      }),
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    }),
  ],
  exports: [MulterModule],
})
export class MediaModule {}
