import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from '../../../cloudinary/services/cloudinary.service';
import { ProductImage } from '../../domain/models/productImages';

@Injectable()
export class UploadProductImages {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly logger: Logger,
  ) {}

  /**
   * Upload images to Cloudinary
   * @param images - images to upload
   * @param productName - name of the product
   * @returns array of uploaded ProductImage instances
   */
  public async execute(images: Express.Multer.File[], productName: string) {
    return await Promise.all(
      images.map(async (image, index) => {
        try {
          this.logger.log(`Subiendo imagen ${index + 1} de ${productName}...`);
          // 6.1 Upload image to Cloudinary
          const response = await this.cloudinaryService.uploadImage(image);
          this.logger.log(`Imagen ${index + 1} subida con éxito.`);
          // Extract details from response
          const { secure_url, public_id } = response;
          const isPrimary = index === 0;
          const order = index + 1;
          const altText = `Imagen ${index + 1} de ${productName}`;

          // 6.2 Create ProductImage instance and add to the array
          const productImage = ProductImage.create(
            secure_url,
            public_id,
            altText,
            order,
            isPrimary,
          );
          this.logger.log(
            `Imagen ${index + 1} asociada al producto ${productName}.`,
          );
          return productImage;
        } catch (error) {
          this.logger.error(
            `Error al subir la imagen ${index + 1} de ${productName}: ${error.message}`,
          );
          throw new BadRequestException(
            'Error al subir la imagen: ' + error.message,
          );
        }
      }),
    );
  }
}
