import { Injectable } from '@nestjs/common';
import { CreateCustomerRequest } from '../requests/createCustomerRequest';
import { CustomerService } from './../../infrastructure/services/customer.service';

@Injectable()
export class UpdateCustomer {
  constructor(private readonly customerService: CustomerService) {}

  async execute(
    id: number,
    request: Partial<CreateCustomerRequest>,
    userId: string,
  ) {
    // 1. Ensure the customer exists
    const customer = await this.customerService.findById(id);

    // 2. Update the customer with the provided data
    Object.assign(customer, request);

    // 3. Save the updated customer
    return this.customerService.update(customer, userId);
  }
}
