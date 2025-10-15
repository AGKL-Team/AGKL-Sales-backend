import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auditory } from './../../../core/auth/domain/interfaces/auditory';
import { Product } from './../../../products/domain/models/product';
import { Sale } from './sale';

export class ProductSale implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 15, scale: 2 })
  unitPrice: number;

  @Column('int')
  productId: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @Column('int')
  saleId: number;

  @ManyToOne(() => Sale, (sale) => sale.products)
  sale: Sale;

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
   * Changes the quantity of the product in the sale.
   * @param quantity The new quantity of the product in the sale.
   */
  changeQuantity(quantity: number) {
    this.quantity = quantity;
  }

  /**
   * Creates a new instance of ProductSale.
   * @param product The product to add to the sale.
   * @param quantity The quantity of the product to add.
   * @returns A new instance of ProductSale.
   */
  static create(product: Product, quantity: number) {
    const productSale = new ProductSale();
    productSale.product = product;
    productSale.quantity = quantity;
    productSale.unitPrice = product.price;
    return productSale;
  }
}
