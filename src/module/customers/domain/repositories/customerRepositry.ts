import { Customer } from '../models/customer';

export interface CustomerRepository {
  /**
   * Find all customers.
   * @returns A promise that resolves to an array of Customer objects.
   */
  findAll(): Promise<Customer[]>;

  /**
   * Find a customer by ID.
   * @param id - The ID of the customer to find.
   */
  findById(id: number): Promise<Customer>;

  /**
   * Save a new customer.
   * @param customer - the new customer to be created
   * @param userId - the id of the user who is creating the customer
   */
  save(customer: Customer, userId: string): Promise<void>;

  /**
   * Update an existing customer.
   * @param customer - the customer to be updated
   * @param userId - the id of the user who is updating the customer
   */
  update(customer: Customer, userId: string): Promise<void>;

  /**
   * Delete a customer by ID.
   * @param id - The ID of the customer to delete.
   * @param userId - the id of the user who is deleting the customer
   */
  delete(id: number, userId: string): Promise<void>;
}
