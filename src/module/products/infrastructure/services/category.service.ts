import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { BrandCategory } from '../../domain/models/brand-category';
import { Category } from '../../domain/models/category';
import { CategoryRepository } from '../../domain/repositories/categoryRepository';

@Injectable()
export class CategoryService implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(BrandCategory)
    private readonly brandCategoryRepository: Repository<BrandCategory>,
  ) {}

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('No se encuentra la categoria');
    }

    return category;
  }

  async findAllForBrand(brandId: number): Promise<Category[]> {
    const brandCategories = await this.brandCategoryRepository.find({
      where: { brandId },
      relations: { category: true },
    });

    return brandCategories.map((bc) => bc.category);
  }

  async save(category: Category, userId: string): Promise<Category> {
    category.createdAt = new Date();
    category.createdBy = userId;

    return await this.categoryRepository.save(category);
  }

  async update(category: Category, userId: string): Promise<Category> {
    category.updatedAt = new Date();
    category.updatedBy = userId;

    return await this.categoryRepository.save(category);
  }

  async delete(id: number, userId: string): Promise<void> {
    const brand = await this.findById(id);

    brand.deletedAt = new Date();
    brand.deletedBy = userId;

    await this.categoryRepository.save(brand);
  }

  async alreadyExistsCategoryByBrand(name: string, brandId: number) {
    const category = await this.brandCategoryRepository.findOne({
      where: {
        brandId,
        category: {
          name,
        },
      },
      relations: {
        category: true,
      },
    });

    return !!category;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: { deletedAt: IsNull() },
    });
    if (!categories) {
      return [];
    }

    return categories;
  }
}
