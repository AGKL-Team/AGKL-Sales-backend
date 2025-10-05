import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ProductFilters } from '../../domain/interfaces/productFilters';
import { Product } from '../../domain/models/product';
import { ProductImage } from '../../domain/models/productImages';
import { ProductRepository } from '../../domain/repositories/productRepository';

@Injectable()
export class ProductService implements ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findAll(filters: ProductFilters): Promise<Product[]> {
    // 1. Pagination logic
    let take: number;
    let skip: number;
    if (filters.size && filters.page) {
      take = filters.size;
      skip = (filters.page - 1) * filters.size;
    } else {
      take = 50;
      skip = 0;
    }

    // 2. Dynamic filtering
    return await this.repository.find({
      where: {
        ...(filters.name && { name: filters.name }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.brandId && { brandId: filters.brandId }),
        ...(filters.minPrice && { price: LessThanOrEqual(filters.minPrice) }),
        ...(filters.maxPrice && { price: MoreThanOrEqual(filters.maxPrice) }),
      },
      take,
      skip,
    });
  }

  async findById(id: number): Promise<Product> {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('No se encuentra el producto');
    }

    return product;
  }

  async save(product: Product, userId: string): Promise<Product> {
    // 1. Set audit fields
    product.createdAt = new Date();
    product.createdBy = userId;

    // 2. Handle image files
    if (product.images.length > 0) {
      product.images = product.images.map((image) => {
        image.createdAt = new Date();
        image.createdBy = userId;

        return image;
      });
    }

    // 3. Save the product entity
    return await this.repository.save(product);
  }

  async update(
    product: Product,
    images: ProductImage[],
    userId: string,
  ): Promise<void> {
    // 1. Ensure the product exists
    await this.findById(product.id);

    // 2. Update audit fields
    product.updatedAt = new Date();
    product.updatedBy = userId;

    // 3. Handle new image files
    if (images && images.length > 0) {
      const newImages = images.map((file, index) => {
        const { url, imageId } = file;
        const altText = '';

        // Order continues from existing images
        const order = product.images.length + index + 1;
        const isPrimary = false;

        const image = ProductImage.create(
          url,
          imageId,
          altText,
          order,
          isPrimary,
        );

        image.createdAt = new Date();
        image.createdBy = userId;

        return image;
      });

      product.images = [...(product.images || []), ...newImages];
    }

    // 4. Save the updated product entity
    await this.repository.save(product);
  }

  async delete(id: number, userId: string): Promise<void> {
    const product = await this.findById(id);

    product.deletedAt = new Date();
    product.deletedBy = userId;

    await this.repository.save(product);
  }

  async findAllByCategory(filters: ProductFilters): Promise<Product[]> {
    return await this.findAll(filters);
  }

  async findAllByBrand(filters: ProductFilters): Promise<Product[]> {
    return await this.findAll(filters);
  }

  async alreadyExists(name: string): Promise<boolean> {
    return await this.repository.exists({
      where: { name, deletedAt: IsNull() },
    });
  }
}
