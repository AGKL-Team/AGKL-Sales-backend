import { Logger, Module } from '@nestjs/common';
import { ProductModule } from '../module/products/product.module';
import { CustomerModule } from './../module/customers/customer.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../config/configuration.module';
import { AuthModule } from '../module/core/auth/auth.module';
import { DatabaseModule } from '../module/core/database/database.module';
import { SaleModule } from '../module/sales/sale.module';

@Module({
  imports: [
    ConfigurationModule,
    // Configuración de TypeOrm
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeoutMS: 30000,
    }),
    // Incluye módulos generales
    AuthModule,
    DatabaseModule,
    // Módulos del dominio
    CustomerModule,
    ProductModule,
    SaleModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
