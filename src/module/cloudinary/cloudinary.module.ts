import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig from 'config/cloudinary.config';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  imports: [ConfigModule.forFeature(cloudinaryConfig)],
  providers: [
    CloudinaryService,
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('cloudinary.cloud_name'),
          api_key: configService.get<string>('cloudinary.api_key'),
          api_secret: configService.get<string>('cloudinary.api_secret'),
          secure: true,
        });
        return cloudinary;
      },
    },
  ],
  exports: ['CLOUDINARY', CloudinaryService],
})
export class CloudinaryModule {}
