import { ProductFilters } from '../interfaces/productFilters';
import { Product } from '../models/product';

export interface ProductRepository {
  findAll(filters: ProductFilters): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;

  save(product: Product, userId: string): Promise<void>;
  update(product: Product, userId: string): Promise<void>;
  delete(id: string, userId: string): Promise<void>;

  findAllByCategory(filters: ProductFilters): Promise<Product[]>;
  findAllByBrand(filters: ProductFilters): Promise<Product[]>;
  findAllByLine(filters: ProductFilters): Promise<Product[]>;
}
