export interface ProductFilters {
  name?: string;

  categoryId?: number;
  brandId?: number;
  lineId?: number;

  page?: number;
  size?: number;

  minPrice?: number;
  maxPrice?: number;
}
