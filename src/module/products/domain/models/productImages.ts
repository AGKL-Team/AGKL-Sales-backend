import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audithory } from '../interfaces/audithory';
import { Product } from './product';

@Entity('product_images')
export class ProductImage implements Audithory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  productId: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column('varchar', { length: 500 })
  url: string;

  @Column('varchar', { length: 255, nullable: true })
  altText: string | null;

  @Column('int', { default: 0 })
  order: number;

  @Column('boolean', { default: false })
  isPrimary: boolean;

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
}
