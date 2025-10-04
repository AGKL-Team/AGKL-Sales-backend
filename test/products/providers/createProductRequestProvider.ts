import { randomInt } from 'crypto';
import { fakeBrand } from '../fakes/brand.fake';
import { fakeCategory } from '../fakes/category.fake';
import { CreateProductRequest } from './../../../src/module/products/application/requests/createProductRequest';

/**
 * Provides a valid CreateProductRequest object for testing purposes.
 * Not contains optional fields to simulate different scenarios.
 * @returns A valid CreateProductRequest object
 */
export const ValidCreateProductRequest: () => CreateProductRequest = () => {
  const request = new CreateProductRequest();
  request.name = 'Test Product';
  request.brandId = fakeBrand.id;
  request.price = randomInt(1, 9999);
  request.initialStock = 0;

  return request;
};

/**
 * Provides a valid CreateProductRequest object for testing purposes.
 * Contains the optional categoryId field to simulate different scenarios.
 * @returns A valid CreateProductRequest object with categoryId
 */
export const ValidCreateProductRequestWithCategory: () => CreateProductRequest =
  () => {
    const request = new CreateProductRequest();
    request.name = 'Test Product';
    request.brandId = fakeBrand.id;
    request.categoryId = fakeCategory.id;
    request.price = randomInt(1, 9999);
    request.initialStock = 0;

    return request;
  };

/**
 * Provides a valid CreateProductRequest object for testing purposes.
 * Contains the optional initialStock field to simulate different scenarios.
 * @returns A valid CreateProductRequest object with initial stock
 */
export const ValidCreateProductRequestWithInitialStock: () => CreateProductRequest =
  () => {
    const request = new CreateProductRequest();
    request.name = 'Test Product';
    request.brandId = fakeBrand.id;
    request.price = randomInt(1, 9999);
    request.initialStock = randomInt(1, 100);

    return request;
  };
