import { Brand } from '../models/brand';

export interface BrandRepository {
  findAll(): Promise<Brand[]>;
  findById(brandId: number): Promise<Brand | null>;

  save(brand: Brand): Promise<Brand>;
  update(brand: Brand): Promise<Brand>;
  delete(id: number): Promise<void>;
}
