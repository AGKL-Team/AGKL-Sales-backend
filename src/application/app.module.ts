import { Logger, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'module/products/product.module';
import { ConfigurationModule } from '../config/configuration.module';
import { AuthModule } from '../module/core/auth/auth.module';
import { DatabaseModule } from '../module/core/database/database.module';

@Module({
  imports: [
    ConfigurationModule,
    // Configuración de TypeOrm
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'dev',
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    // Incluye módulos generales
    DatabaseModule,
    AuthModule,
    // Módulos del dominio
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
