import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auditory } from './../../../../../dist/src/module/core/auth/domain/interfaces/auditory.d';
import { Product } from './../../../products/domain/models/product';
import { ProductSale } from './product-sale';

export class Sale implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  number: number;

  @Column('timestamptz')
  date: Date;

  @OneToMany(() => ProductSale, (product) => product.sale, {
    eager: true,
    cascade: true,
  })
  products: ProductSale[];

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
}
