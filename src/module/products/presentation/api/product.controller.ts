import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '@supabase/supabase-js';
import { UserFromRequest } from '../../../core/auth/infrastructure/decorators/user.decorator';
import { SupabaseAuthGuard } from '../../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreateProductRequest } from '../../application/requests/createProductRequest';
import { CreateProduct } from './../../application/useCases/createProductUseCase';
import { ProductService } from './../../infrastructure/services/product.service';

@Controller('products')
@UseGuards(SupabaseAuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly createProduct: CreateProduct,
  ) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('images', 5))
  @HttpCode(HttpStatus.CREATED)
  async save(
    @Body(ValidationPipe) request: CreateProductRequest,
    @UploadedFiles() images: Express.Multer.File[],
    @UserFromRequest() user: User,
  ) {
    await this.createProduct.execute(request, images, user.id);
  }
}
