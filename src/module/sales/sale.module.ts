import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../core/auth/auth.module';
import { DatabaseModule } from '../core/database/database.module';
import { CustomerModule } from './../customers/customer.module';
import { CustomerService } from './../customers/infrastructure/services/customer.service';
import { Product } from './../products/domain/models/product';
import { ProductService } from './../products/infrastructure/services/product.service';
import { ProductModule } from './../products/product.module';
import { ProductSale } from './domain/model/product-sale';
import { Sale } from './domain/model/sale';
import { SaleService } from './infrastructure/services/sale.service';
import { SaleController } from './presentation/api/sale.controller';
import { SaleModuleUseCases } from './providers/saleUseCasesProvider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, ProductSale, Product]),
    DatabaseModule,
    AuthModule,
    ProductModule,
    CustomerModule,
  ],
  controllers: [SaleController],
  providers: [
    Logger,
    CustomerService,
    SaleService,
    ProductService,
    ...SaleModuleUseCases,
  ],
})
export class SaleModule {}
