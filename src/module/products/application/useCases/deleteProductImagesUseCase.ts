import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from './../../../cloudinary/services/cloudinary.service';
import { ProductImage } from './../../domain/models/productImages';
import { ProductService } from './../../infrastructure/services/product.service';

@Injectable()
export class DeleteProductImages {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly logger: Logger,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
  ) {}

  /**
   * Delete product images both from Cloudinary and the database
   * @param imagePublicIds - Public IDs of images
   * @param productId - ID of the product
   */
  async execute(imagePublicIds: string[], productId: number) {
    // 1. Ensure the product exists
    const product = await this.productService.findById(productId);

    // 2. Filter images that belong to the product
    const imagesToDelete = product.images.filter((img) =>
      imagePublicIds.includes(img.imageId),
    );

    if (imagesToDelete.length === 0) {
      this.logger.warn(
        `No se encontraron imágenes para eliminar en el producto con ID ${productId}.`,
      );
      return;
    }

    // 3. Delete images from Cloudinary
    for (const img of imagesToDelete) {
      try {
        await this.cloudinaryService.deleteImage(img.imageId);
        this.logger.log(
          `Imagen con publicId ${img.imageId} eliminada de Cloudinary.`,
        );
      } catch (error) {
        this.logger.error(
          `Error al eliminar la imagen con publicId ${img.imageId} de Cloudinary: ${error.message}`,
        );
      }
    }

    // 4. Remove images from the product entity
    imagesToDelete.forEach((img) => product.removeImage(img.imageId));

    // 5. Update the product in the database
    await this.imageRepository.delete(imagePublicIds);

    this.logger.log(
      `Imágenes eliminadas del producto con ID ${productId} en la base de datos.`,
    );
  }
}
