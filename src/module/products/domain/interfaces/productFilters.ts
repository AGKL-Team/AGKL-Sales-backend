export interface ProductFilters {
  name?: string;

  categoryId?: number;
  brandId?: number;

  page?: number;
  size?: number;

  minPrice?: number;
  maxPrice?: number;
}
