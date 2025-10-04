import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductRequest } from '../requests/createProductRequest';
import { CloudinaryService } from './../../../cloudinary/services/cloudinary.service';
import { Category } from './../../domain/models/category';
import { Product } from './../../domain/models/product';
import { ProductImage } from './../../domain/models/productImages';
import { BrandService } from './../../infrastructure/services/brand.service';
import { CategoryService } from './../../infrastructure/services/category.service';
import { ProductService } from './../../infrastructure/services/product.service';

@Injectable()
export class CreateProduct {
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Create a new product
   * @param request - data to create a product
   * @param images - product images
   * @param userId - user id
   */
  async execute(
    request: CreateProductRequest,
    images: Express.Multer.File[],
    userId: string,
  ) {
    // 1. Ensure the product is not exists by name
    const alreadyExists = await this.productService.alreadyExists(request.name);
    if (alreadyExists) {
      throw new BadRequestException('El producto ya existe');
    }

    // 2. Extract data from request
    const { name, brandId, categoryId, price, initialStock } = request;

    // 3. Ensure the brand exists
    const brand = await this.brandService.findById(brandId);

    // 4. Ensure the category exists, if categoryId is provided
    let category: Category | null = null;
    if (categoryId) {
      category = await this.categoryService.findById(categoryId);
    }

    // 5. Save the product
    const product = Product.create(name, price, initialStock, brand, category);

    // 6. If images are provided, upload them and associate with the product
    const uploadedImages: ProductImage[] = [];
    if (images && images.length > 0) {
      for (const [index, image] of images.entries()) {
        try {
          // 6.1 Upload image to Cloudinary
          const response = await this.cloudinaryService.uploadImage(image);
          const { secure_url, public_id } = response;
          const isPrimary = index === 0;
          const order = index + 1;
          const altText = `Imagen ${index + 1} de ${name}`;

          // 6.2 Create ProductImage instance and add to the array
          uploadedImages.push(
            ProductImage.create(
              secure_url,
              public_id,
              altText,
              order,
              isPrimary,
            ),
          );
        } catch (error) {
          throw new BadRequestException(
            'Error al subir la imagen: ' + error.message,
          );
        }
      }

      // 6.3 Associate images with the product
      if (uploadedImages.length > 0) {
        uploadedImages.forEach((img) =>
          product.addImage(
            img.url,
            img.imageId,
            img.altText ?? '',
            img.order,
            img.isPrimary,
          ),
        );
      }

      // 7. Save the product with images
      return await this.productService.save(product, userId);
    }
  }
}
