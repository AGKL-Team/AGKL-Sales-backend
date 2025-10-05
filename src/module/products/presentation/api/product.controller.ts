import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { UpdateProductRequest } from './../../application/requests/updateProductRequest';
import { CreateProduct } from './../../application/useCases/createProductUseCase';
import { UpdateProduct } from './../../application/useCases/updateProductUseCase';
import { ProductService } from './../../infrastructure/services/product.service';

@Controller('products')
@UseGuards(SupabaseAuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly createProduct: CreateProduct,
    private readonly updateProduct: UpdateProduct,
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

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ValidationPipe({ transform: true })) productId: number,
    @Body(ValidationPipe) request: UpdateProductRequest,
    @UploadedFiles() images: Express.Multer.File[],
    @UserFromRequest() user: User,
  ) {
    await this.updateProduct.execute(productId, request, images, user.id);
  }
}
