import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { SERVICE_CONFIG } from 'src/constants';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: SERVICE_CONFIG,
      useFactory: (config: ConfigService) => {
        cloudinary.config({
          cloud_name: config.get('cloudName'),
          api_key: config.get('apiKey'),
          api_secret: config.get('apiSecret'),
        });
        return cloudinary;
      },
      inject: [ConfigService],
    },
    UploadService,
  ],
  exports: [UploadService],
})
export class UploadModule {}
