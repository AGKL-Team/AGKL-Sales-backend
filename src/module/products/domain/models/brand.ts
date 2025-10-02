import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Auditory } from '../../../core/auth/domain/interfaces/auditory';
import { Category } from './category';

@Entity('brands')
export class Brand implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  description: string;

  @Column('varchar', { length: 1000, nullable: false })
  logoUrl: string;

  @Column('varchar', { length: 150, nullable: false })
  logoId: string;

  @OneToMany(() => Category, (category) => category.brand)
  categories: Category[];

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

  static create(
    name: string,
    logoUrl: string,
    logoId: string,
    description?: string,
  ): Brand {
    const brand = new Brand();
    brand.name = name;
    brand.logoUrl = logoUrl;
    brand.logoId = logoId;
    brand.description = description ?? '';

    return brand;
  }

  /**
   * Change the name of the brand
   * @param name New name for the brand
   */
  changeName(name: string): void {
    this.name = name;
  }

  /**
   * Change the description of the brand
   * @param description New description for the brand
   */
  changeDescription(description: string): void {
    this.description = description;
  }

  /**
   * Change the logo of the brand
   * @param logoUrl New logo URL for the brand
   */
  changeLogoUrl(logoUrl: string): void {
    this.logoUrl = logoUrl;
  }

  /**
   * Change the logo ID of the brand
   * @param logoId New logo ID for the brand
   */
  changeLogoId(logoId: string): void {
    this.logoId = logoId;
  }

  /**
   * Add a category to the brand
   * @param category category to be added to the brand
   */
  addCategory(category: Category): void {
    if (!this.categories) {
      this.categories = [];
    }

    if (
      !this.categories.find(
        (c) => c.name.toLowerCase() === category.name.toLowerCase(),
      )
    ) {
      this.categories.push(category);
      category.brand = this;
    }
  }

  /**
   * Remove a category from the brand
   * @param category Category to be removed from the brand
   */
  removeCategory(category: Category): void {
    if (!this.categories) {
      return;
    }

    this.categories = this.categories.filter((c) => c.id !== category.id);
  }
}
