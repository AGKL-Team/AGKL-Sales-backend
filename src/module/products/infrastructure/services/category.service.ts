import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from '../../domain/models/category';
import { CategoryRepository } from '../../domain/repositories/categoryRespository';

@Injectable()
export class CategoryService implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('No se encuentra la categoria');
    }

    return category;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  async create(category: Category, userId: string): Promise<Category> {
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

  async alreadyExists(name: string): Promise<boolean> {
    const category = await this.categoryRepository.findOne({ where: { name } });
    return !!category;
  }
}
