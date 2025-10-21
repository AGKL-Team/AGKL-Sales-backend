import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../core/auth/auth.module';
import { DatabaseModule } from './../core/database/database.module';
import { Customer } from './domain/models/customer';
import { CustomerService } from './infrastructure/services/customer.service';
import { CustomerController } from './presentation/api/customer.controller';
import { CUSTOMER_USE_CASES } from './providers/customerUseCasesProvider';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), DatabaseModule, AuthModule],
  controllers: [CustomerController],
  providers: [CustomerService, ...CUSTOMER_USE_CASES],
  exports: [],
})
export class CustomerModule {}
