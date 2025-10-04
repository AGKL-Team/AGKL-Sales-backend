import { Category } from './../../../src/module/products/domain/models/category';
import { fakeBrand } from './brand.fake';

/**
 * Fake Category for tests
 */
export const fakeCategory: Category = Category.create(
  'Category Test',
  fakeBrand,
  1,
);
