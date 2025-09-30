import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auditory } from '../../../core/auth/domain/interfaces/auditory';
import { Brand } from './brand';
import { Category } from './category';
import { Line } from './line';
import { ProductImage } from './productImages';

@Entity('products')
export class Product implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('int')
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.id)
  brand: Brand;

  @Column('int', { nullable: true })
  lineId: number | null;

  @ManyToOne(() => Line, (line) => line.id, { nullable: true })
  line: Line | null;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: false,
  })
  images: ProductImage[];

  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Column('decimal', { precision: 8, scale: 2 })
  stock: number;

  @Column('int')
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

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

  @Column('boolean', { default: false })
  isDeleted: boolean;

  /**
   * Add a new price to the product
   * @param price the new price to add
   */
  changePrice(price: number) {
    this.price = price;
  }

  /**
   * Assign a line to the product
   * @param line the line to assign
   * @throws Error if the line doesn't belong to the same brand as the product
   */
  assignLine(line: Line): void {
    if (line.brandId !== this.brandId) {
      throw new Error('The line must belong to the same brand as the product');
    }
    this.line = line;
    this.lineId = line.id;
  }

  /**
   * Remove the line assignment from the product
   */
  removeLine(): void {
    this.line = null;
    this.lineId = null;
  }

  /**
   * Check if the product has a line assigned
   * @returns true if the product has a line, false otherwise
   */
  hasLine(): boolean {
    return this.line !== null && this.lineId !== null;
  }

  /**
   * Check if the product can be sold
   * @param sellQuantity the quantity to sell
   * @returns  true if the product can be sold, false otherwise
   */
  canSell(sellQuantity: number): boolean {
    return this.stock >= sellQuantity;
  }

  /**
   *  Add an image to the product
   * @param imageUrl Url of the image
   * @param imageId  ID of the image
   * @param altText Alternative text for the image
   * @param order Order of the image
   */
  addImage(
    imageUrl: string,
    imageId: string,
    altText?: string,
    order?: number,
  ) {
    if (!this.images) {
      this.images = [];
    }

    const newImage = ProductImage.create(
      imageUrl,
      imageId,
      altText || '',
      order,
      this.images.length === 0,
    );

    this.images.push(newImage);
  }

  removeImage(imageUrl: string) {
    if (!this.images) {
      return;
    }
    this.images = this.images.filter(
      (img) => img.url !== imageUrl && !img.deletedAt,
    );
  }

  getPrimaryImage(): ProductImage | null {
    if (!this.images || this.images.length === 0) {
      return null;
    }
    return (
      this.images.find((img) => img.isPrimary && !img.deletedAt) ||
      this.images[0]
    );
  }

  getImageUrls(): string[] {
    if (!this.images) {
      return [];
    }
    return this.images
      .filter((img) => !img.deletedAt)
      .sort((a, b) => a.order - b.order)
      .map((img) => img.url);
  }
}
