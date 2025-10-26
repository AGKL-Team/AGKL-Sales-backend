import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandCategory } from './../../domain/models/brand-category';
import { BrandService } from './../../infrastructure/services/brand.service';
import { CategoryService } from './../../infrastructure/services/category.service';

@Injectable()
export class AssociateCategoryToBrand {
  constructor(
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    @InjectRepository(BrandCategory)
    private readonly brandCategoryRepository: Repository<BrandCategory>,
  ) {}

  async execute(categoryId: number, brandId: number): Promise<void> {
    // 1. Ensure the brand and category exist
    const brand = await this.brandService.findById(brandId);
    const category = await this.categoryService.findById(categoryId);

    // If the category already associated, do nothing
    if (brand.categories.some((cat) => cat.id === category.id)) {
      return;
    }

    // 2. Associate the category with the brand
    brand.addCategory(category);

    // 3. Save the updated brand
    await this.brandCategoryRepository.save(
      BrandCategory.create(brand, category),
    );
  }
}
