import { Inject, Injectable } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) {}

  async uploadImage(image: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'agkl-sales' },
        (error, result) => {
          // If there is an error, reject the promise
          if (error)
            return reject(
              new Error('Error uploading file to Cloudinary: ' + error.message),
            );

          // If there is no result, reject the promise
          if (!result) return reject(new Error('No result from Cloudinary'));

          // Otherwise, resolve the promise with the result
          resolve(result);
        },
      );

      // Returns a Buffer
      stream.end(image.buffer);
    });
  }

  async deleteImage(publicId: string) {
    return await this.cloudinary.uploader.destroy(publicId);
  }

  getImageUrl(publicId: string, options?: { width?: number; height?: number }) {
    return this.cloudinary.url(publicId, {
      secure: true,
      transformation: [
        { width: options?.width, height: options?.height, crop: 'fill' },
      ],
    });
  }
}
