import { Injectable } from '@nestjs/common';
import { CustomerService } from '../../infrastructure/services/customer.service';
import { CreateCustomerRequest } from '../requests/createCustomerRequest';
import { Customer } from './../../domain/models/customer';

@Injectable()
export class CreateCustomer {
  constructor(private readonly customerService: CustomerService) {}

  async execute(request: CreateCustomerRequest, userId: string): Promise<void> {
    const customer = Customer.create(request.name, request.lastName);

    await this.customerService.save(customer, userId);
  }
}
