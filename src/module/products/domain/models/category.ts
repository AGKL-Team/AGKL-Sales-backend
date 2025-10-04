import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auditory } from '../../../core/auth/domain/interfaces/auditory';
import { Brand } from './brand';

@Entity('product_categories')
export class Category implements Auditory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('int')
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.categories)
  brand: Brand;

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
   * Changes the category name
   * @param name - new name for category
   */
  changeName(name: string) {
    this.name = name;
  }

  /**
   * Factory method to create an instance of Category
   * @param name - name of category
   * @param brand - brand who contains the category
   * @param id - category id
   */
  static create(name: string, brand: Brand, id?: number) {
    const category = new Category();
    category.name = name;
    category.brand = brand;
    if (id) category.id = id;

    return category;
  }
}
