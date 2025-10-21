import { Brand } from '../models/brand';
import { Category } from '../models/category';

export interface BrandRepository {
  findAll(): Promise<Brand[]>;
  findById(brandId: number): Promise<Brand>;

  save(brand: Brand, userId: string): Promise<Brand>;
  update(brand: Brand, userId: string): Promise<Brand>;
  delete(id: number, userId: string): Promise<void>;

  nameIsDuplicated(name: string): Promise<boolean>;

  saveCategory(brand: Brand, category: Category): Promise<void>;
}
