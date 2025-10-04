import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
    private readonly logger: Logger,
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
      this.logger.error(`El producto ${request.name} ya existe.`);
      throw new BadRequestException('El producto ya existe');
    }
    this.logger.log(`Producto ${request.name} único, procediendo...`);

    // 2. Ensure at least one image is provided
    if (!images || images.length === 0) {
      this.logger.error(
        `No se proporcionaron imágenes para el producto ${request.name}`,
      );
      throw new BadRequestException('Se debe proporcionar al menos una imagen');
    }
    this.logger.log(`Se han proporcionado ${images.length} imágenes.`);

    // 2. Extract data from request
    const { name, brandId, categoryId, price, initialStock } = request;

    // 3. Ensure the brand exists
    const brand = await this.brandService.findById(brandId);
    this.logger.log(`Marca con ID ${brandId} encontrada.`);

    // 4. Ensure the category exists, if categoryId is provided
    let category: Category | null = null;
    if (categoryId) {
      this.logger.log(`Buscando categoría con ID ${categoryId}...`);
      category = await this.categoryService.findById(categoryId);
      this.logger.log(`Categoría con ID ${categoryId} encontrada.`);
    }

    // 5. Save the product
    const product = Product.create(
      name,
      price,
      initialStock ?? 0,
      brand,
      category,
    );
    this.logger.log(`Producto ${name} creado en memoria.`);

    // 6. Upload them and associate with the product
    const uploadedImages: ProductImage[] = [];
    this.logger.log(`Subiendo imágenes para el producto ${name}...`);

    for (const [index, image] of images.entries()) {
      try {
        this.logger.log(`Subiendo imagen ${index + 1} de ${name}...`);
        // 6.1 Upload image to Cloudinary
        const response = await this.cloudinaryService.uploadImage(image);
        this.logger.log(`Imagen ${index + 1} subida con éxito.`);
        // Extract details from response
        const { secure_url, public_id } = response;
        const isPrimary = index === 0;
        const order = index + 1;
        const altText = `Imagen ${index + 1} de ${name}`;

        // 6.2 Create ProductImage instance and add to the array
        const productImage = ProductImage.create(
          secure_url,
          public_id,
          altText,
          order,
          isPrimary,
        );
        this.logger.log(`Imagen ${index + 1} asociada al producto ${name}.`);
        uploadedImages.push(productImage);
      } catch (error) {
        this.logger.error(
          `Error al subir la imagen ${index + 1} de ${name}: ${error.message}`,
        );
        throw new BadRequestException(
          'Error al subir la imagen: ' + error.message,
        );
      }
    }

    // 6.3 Associate images with the product
    uploadedImages.forEach((img) =>
      product.addImage(
        img.url,
        img.imageId,
        img.altText ?? '',
        img.order,
        img.isPrimary,
      ),
    );
    this.logger.log(`Todas las imágenes asociadas al producto ${name}.`);

    // 7. Save the product with images
    this.logger.log(`Guardando producto ${name}...`);
    return await this.productService.save(product, userId);
  }
}
