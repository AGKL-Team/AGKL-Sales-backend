import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { Brand } from './domain/models/brand';
import { Category } from './domain/models/category';
import { Line } from './domain/models/line';
import { Product } from './domain/models/product';
import { ProductImage } from './domain/models/productImages';
import { BrandService } from './infrastructure/services/brand.service';
import { CategoryService } from './infrastructure/services/category.service';
import { LineService } from './infrastructure/services/line.service';
import { ProductService } from './infrastructure/services/product.service';
import { BrandController } from './presentation/api/brand.controller';
import { LineController } from './presentation/api/line.controller';
import { ProductModuleUseCases } from './providers/productUseCasesProvider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, Line, Product, ProductImage, Category]),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [BrandController, LineController],
  providers: [
    BrandService,
    LineService,
    ProductService,
    CategoryService,
    ...ProductModuleUseCases,
  ],
  exports: [],
})
export class ProductModule {}
