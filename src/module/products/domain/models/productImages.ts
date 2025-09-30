import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auditory } from '../../../core/auth/domain/interfaces/auditory';
import { Product } from './product';

@Entity('product_images')
export class ProductImage implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  productId: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column('varchar', { length: 1000 })
  url: string;

  @Column('varchar', { length: 150 })
  imageId: string;

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

  /**
   * Factory method to create a ProductImage from a file and userId
   * @param imageUrl - URL of the uploaded image
   * @param imageId - ID of the uploaded image in the storage service
   * @param altText - Alternative text for the image
   * @param order - Order of the image
   * @param isPrimary - Whether this image is the primary image
   * @returns A new instance of ProductImage
   */
  static create(
    imageUrl: string,
    imageId: string,
    altText: string,
    order: number = 1,
    isPrimary: boolean = false,
  ): ProductImage {
    const image = new ProductImage();
    image.url = imageUrl;
    image.imageId = imageId;
    image.altText = altText || null;
    image.order = order;
    image.isPrimary = isPrimary;

    return image;
  }
}
