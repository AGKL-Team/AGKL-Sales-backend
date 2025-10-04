import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from 'module/products/domain/models/category';
import { BrandService } from '../../infrastructure/services/brand.service';
import { CategoryService } from '../../infrastructure/services/category.service';
import { CreateCategoryRequest } from '../requests/createCategoryRequest';

@Injectable()
export class CreateCategory {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) {}

  async execute({ name, brandId }: CreateCategoryRequest, userId: string) {
    // 1. Ensure the brand exists
    const brand = await this.brandService.findById(brandId);

    // 2. Ensure the name is unique by brand
    const alreadyExists =
      await this.categoryService.alreadyExistsCategoryByBrand(name, brandId);

    if (alreadyExists)
      throw new BadRequestException(
        `Ya existe una categoría con el nombre ${name}`,
      );

    // 3. Crea la categoría
    const category = Category.create(name, brand);
    await this.categoryService.create(category, userId);

    brand.addCategory(category);
  }
}
