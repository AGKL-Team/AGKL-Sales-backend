import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Customer } from './../../domain/models/customer';
import { CustomerRepository } from './../../domain/repositories/customerRepositry';

@Injectable()
export class CustomerService implements CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  async findById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: {
        id: id,
        deletedAt: IsNull(),
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async save(customer: Customer, userId: string): Promise<void> {
    customer.createdBy = userId;
    customer.createdAt = new Date();

    await this.customerRepository.save(customer);
  }

  async update(customer: Customer, userId: string): Promise<void> {
    customer.updatedBy = userId;
    customer.updatedAt = new Date();

    await this.customerRepository.save(customer);
  }

  async delete(id: number, userId: string): Promise<void> {
    const customer = await this.findById(id);

    if (!customer) {
      throw new NotFoundException('No se encontró al cliente');
    }

    customer.deletedBy = userId;
    customer.deletedAt = new Date();

    await this.customerRepository.save(customer);
  }
}
