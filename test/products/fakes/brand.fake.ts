import { Brand } from './../../../src/module/products/domain/models/brand';

/**
 * Fake Brand for tests
 */
export const fakeBrand: Brand = Brand.create(
  'Brand Test',
  'https://fake-url.com',
  'fake-logo-id',
  'Some description',
  1,
);
