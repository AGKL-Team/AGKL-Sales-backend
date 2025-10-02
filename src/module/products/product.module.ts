import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthModule } from '../core/auth/auth.module';
import { DatabaseModule } from '../core/database/database.module';
import { Brand } from './domain/models/brand';
import { Category } from './domain/models/category';
import { Product } from './domain/models/product';
import { ProductImage } from './domain/models/productImages';
import { BrandService } from './infrastructure/services/brand.service';
import { CategoryService } from './infrastructure/services/category.service';
import { ProductService } from './infrastructure/services/product.service';
import { BrandController } from './presentation/api/brand.controller';
import { CategoryController } from './presentation/api/category.controller';
import { ProductModuleUseCases } from './providers/productUseCasesProvider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, Product, ProductImage, Category]),
    DatabaseModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [BrandController, CategoryController],
  providers: [
    Logger,
    BrandService,
    ProductService,
    CategoryService,
    ...ProductModuleUseCases,
  ],
  exports: [],
})
export class ProductModule {}
