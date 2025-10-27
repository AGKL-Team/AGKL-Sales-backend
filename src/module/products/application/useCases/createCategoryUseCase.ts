import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../infrastructure/services/category.service';
import { CreateCategoryRequest } from '../requests/createCategoryRequest';
import { Category } from './../../domain/models/category';

@Injectable()
export class CreateCategory {
  constructor(private readonly categoryService: CategoryService) {}

  async execute({ name }: CreateCategoryRequest, userId: string) {
    // 1. Crea la categoría
    const category = Category.create(name);

    await this.categoryService.save(category, userId);
  }
}
