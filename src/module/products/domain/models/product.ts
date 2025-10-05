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
import { ProductImage } from './productImages';

@Entity('products')
export class Product implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 255, default: '', nullable: true })
  description: string;

  @Column('int')
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.id)
  brand: Brand;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: false,
  })
  images: ProductImage[];

  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Column('decimal', { precision: 8, scale: 2 })
  stock: number;

  @Column('int', { nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Category, (category) => category.id, { nullable: true })
  category: Category | null;

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
   * Change the name of the product
   * @param name the new name of the product
   */
  changeName(name: string) {
    this.name = name;
  }

  /**
   * Change the description of the product
   * @param description the new description of the product
   */
  changeDescription(description: string) {
    this.description = description;
  }

  /**
   * Add a new price to the product
   * @param price the new price to add
   */
  changePrice(price: number) {
    this.price = price;
  }

  /**
   * Assign a category to the product
   * @param category the category to assign
   * @throws Error if the category doesn't belong to the same brand as the product
   */
  assignCategory(category: Category): void {
    if (category.brandId !== this.brandId) {
      throw new Error(
        'The category must belong to the same brand as the product',
      );
    }
    this.category = category;
    this.categoryId = category.id;
  }

  /**
   * Remove the category assignment from the product
   */
  removeCategory(): void {
    this.category = null;
    this.categoryId = null;
  }

  /**
   * Check if the product has a category assigned
   * @returns true if the product has a category, false otherwise
   */
  hasCategory(): boolean {
    return this.category !== null && this.categoryId !== null;
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
   * @param isPrimary Whether the image is the primary image
   */
  addImage(
    imageUrl: string,
    imageId: string,
    altText?: string,
    order?: number,
    isPrimary: boolean = false,
  ) {
    if (!this.images) {
      this.images = [];
    }

    const newImage = ProductImage.create(
      imageUrl,
      imageId,
      altText || '',
      order,
      isPrimary,
    );

    this.images.push(newImage);
  }

  /**
   * Removes an image from the product
   * @param imageId public ID of the image to remove
   * @returns void
   */
  removeImage(imageId: string) {
    if (!this.images) {
      return;
    }

    this.images = this.images.filter(
      (img) => img.imageId !== imageId && !img.deletedAt,
    );
  }

  /**
   * Get the primary image of the product
   * @returns The primary image of the product or null if there are no images
   */
  getPrimaryImage(): ProductImage | null {
    if (!this.images || this.images.length === 0) {
      return null;
    }
    return (
      this.images.find((img) => img.isPrimary && !img.deletedAt) ||
      this.images[0]
    );
  }

  /**
   * Get all image URLs of the product
   * @returns Array of image URLs
   */
  getImageUrls(): string[] {
    if (!this.images) {
      return [];
    }
    return this.images
      .filter((img) => !img.deletedAt)
      .sort((a, b) => a.order - b.order)
      .map((img) => img.url);
  }

  /**
   * Increase the stock of the product
   * @param quantity Quantity to increase the stock
   */
  increaseStock(quantity: number): void {
    this.stock += quantity;
  }

  /**
   * Decrease the stock of the product
   * @param quantity Quantity to decrease from stock
   * @throws Error if there is not enough stock to decrease
   */
  decreaseStock(quantity: number): void {
    if (quantity > this.stock) {
      throw new Error('Insufficient stock to decrease');
    }
    this.stock -= quantity;
  }

  /**
   * Factory method to create a new product instance
   * @param name - Name of the product
   * @param price - Price of the product
   * @param stock - Initial stock of the product
   * @param brand - Brand associated with the product
   * @param category - (Optional) Category associated with the product
   * @returns A new Product instance
   */
  static create(
    name: string,
    price: number,
    stock: number,
    brand: Brand,
    category: Category | null,
  ): Product {
    const product = new Product();
    product.name = name;
    product.price = price;
    product.stock = stock;
    product.brand = brand;
    if (category) product.category = category;

    product.images = [];

    return product;
  }
}
