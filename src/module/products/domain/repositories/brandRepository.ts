import { Brand } from '../models/brand';

export interface BrandRepository {
  findAll(): Promise<Brand[]>;
  findById(brandId: number): Promise<Brand | null>;

  save(brand: Brand, userId: string): Promise<Brand>;
  update(brand: Brand, userId: string): Promise<Brand>;
  delete(id: number, userId: string): Promise<void>;

  nameIsDuplicated(name: string): Promise<boolean>;
}
