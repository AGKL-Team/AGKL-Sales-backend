import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../core/auth/auth.module';
import { DatabaseModule } from '../core/database/database.module';
import { ProductSale } from './domain/model/product-sale';
import { Sale } from './domain/model/sale';
import { SaleController } from './presentation/api/sale.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, ProductSale]),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [SaleController],
  providers: [Logger, SaleService, ...SaleModuleUseCases],
})
export class SaleModule {}
