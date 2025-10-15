import { Injectable, Logger } from '@nestjs/common';
import { UpdateProductRequest } from '../requests/updateProductRequest';
import { CloudinaryService } from './../../../cloudinary/services/cloudinary.service';
import { ProductImage } from './../../domain/models/productImages';
import { ProductService } from './../../infrastructure/services/product.service';
import { DeleteProductImages } from './deleteProductImagesUseCase';
import { UploadProductImages } from './uploadProductImagesUseCase';

@Injectable()
export class UpdateProduct {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly uploadImages: UploadProductImages,
    private readonly deleteImages: DeleteProductImages,
    private readonly logger: Logger,
  ) {}

  async execute(
    productId: number,
    request: UpdateProductRequest,
    images: Express.Multer.File[],
    userId: string,
  ) {
    // 1.Ensure the product exists
    const product = await this.productService.findById(productId);

    // 2. Update the product details
    if (request.name) product.changeName(request.name);
    if (request.description) product.changeDescription(request.description);
    if (request.price) product.changePrice(request.price);

    // 3. Check if there are new images to upload
    const uploadResults: ProductImage[] = [];
    if (images && images.length > 0) {
      // 3.1 Upload new images to Cloudinary
      uploadResults.push(
        ...(await this.uploadImages.execute(images, product.name)),
      );
    }

    // 4. Remove the images marked for deletion
    if (request.imagesToRemove && request.imagesToRemove.length > 0) {
      this.logger.log(
        `Eliminando ${request.imagesToRemove.length} imágenes del producto ${product.name}...`,
      );
      await this.deleteImages.execute(request.imagesToRemove, productId);
    }

    // 5. Update the product
    await this.productService.update(product, uploadResults, userId);
  }
}
