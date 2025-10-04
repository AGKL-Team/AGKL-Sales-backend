import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { UserFromRequest } from '../../../core/auth/infrastructure/decorators/user.decorator';
import { SupabaseAuthGuard } from '../../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreateCategoryRequest } from '../../application/requests/createCategoryRequest';
import { CreateCategory } from '../../application/useCases/createCategoryUseCase';
import { UpdateCategory } from '../../application/useCases/updateCategoryUseCase';
import { CategoryService } from '../../infrastructure/services/category.service';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly service: CategoryService,
    private readonly createCategory: CreateCategory,
    private readonly updateCategory: UpdateCategory,
  ) {}

  @Get('brand/:brandId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async getAll(
    @Param('brandId', new ValidationPipe({ transform: true })) brandId: number,
  ) {
    return await this.service.findAllForBrand(brandId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async getById(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
  ) {
    return await this.service.findById(id);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SupabaseAuthGuard)
  async save(
    @Body(ValidationPipe) request: CreateCategoryRequest,
    @UserFromRequest() user: User,
  ) {
    const { name, brandId } = request;
    return await this.createCategory.execute({ name, brandId }, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async update(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
    @Body(ValidationPipe) name: string,
    @UserFromRequest() user: User,
  ) {
    return await this.updateCategory.execute(id, name, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(SupabaseAuthGuard)
  async delete(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
    @UserFromRequest() user: User,
  ) {
    return await this.service.delete(id, user.id);
  }
}
