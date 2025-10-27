import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auditory } from './../../../core/auth/domain/interfaces/auditory';
import { Customer } from './../../../customers/domain/models/customer';
import { Product } from './../../../products/domain/models/product';
import { ProductSale } from './product-sale';

@Entity('sales')
export class Sale implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  number: number;

  @Column('timestamptz')
  date: Date;

  @OneToMany(() => ProductSale, (productSale) => productSale.sale, {
    eager: true,
    cascade: true,
  })
  products: ProductSale[];

  @Column('int')
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.sales)
  customer: Customer;

  @Column('timestamptz')
  createdAt: Date;
  @Column('uuid')
  createdBy: string;
  @Column('timestamptz', { nullable: true })
  updatedAt: Date | null;
  @Column('uuid', { nullable: true })
  updatedBy: string | null;
  @Column('timestamptz', { nullable: true })
  deletedAt: Date | null;
  @Column('uuid', { nullable: true })
  deletedBy: string | null;

  /**
   * Adds a product to the sale.
   * @param product The product to add.
   * @param quantity The quantity of the product to add.
   */
  addProduct(product: Product, quantity: number) {
    if (!this.products) {
      this.products = [];
    }

    const productSale = ProductSale.create(product, quantity, this);
    this.products.push(productSale);
  }

  /**
   * Removes a product from the sale.
   * @param productId The ID of the product to remove from the sale.
   */
  removeProduct(productId: number) {
    this.products = this.products.filter(
      (productSale) => productSale.productId !== productId,
    );
  }

  /**
   * Factory method to create an instance of Sale
   */
  static create(number: number, customer: Customer): Sale {
    const sale = new Sale();
    sale.number = number;
    sale.date = new Date();
    sale.customer = customer;

    return sale;
  }
}
