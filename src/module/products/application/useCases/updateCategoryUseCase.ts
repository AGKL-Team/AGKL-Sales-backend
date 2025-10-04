import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../infrastructure/services/category.service';

@Injectable()
export class UpdateCategory {
  constructor(private readonly categoryService: CategoryService) {}

  async execute(categoryId: number, name: string, userId: string) {
    // 1. Find category
    const category = await this.categoryService.findById(categoryId);

    // 2. Update the name
    category.changeName(name);

    // 3. Save changes
    await this.categoryService.update(category, userId);
  }
}
