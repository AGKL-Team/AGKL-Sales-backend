import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand';
import { Category } from './category';

@Entity('brand_categories')
export class BrandCategory {
  constructor(brand: Brand, category: Category, id: number) {
    this.brand = brand;
    this.category = category;
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public brandId: number;

  @ManyToOne(() => Brand)
  public brand: Brand;

  @Column('int')
  public categoryId: number;

  @ManyToOne(() => Category)
  public category: Category;

  public static create(brand: Brand, category: Category): BrandCategory {
    return new BrandCategory(brand, category, 0);
  }
}
