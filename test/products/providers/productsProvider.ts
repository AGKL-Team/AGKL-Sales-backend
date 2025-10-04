import { randomInt } from 'crypto';
import { fakeBrand } from '../fakes/brand.fake';
import { fakeCategory } from '../fakes/category.fake';
import { Product } from './../../../src/module/products/domain/models/product';
export class ProductFactory {
  /**
   * Creates a single product for testing purposes.
   */
  static create(price?: number, stock?: number): Product {
    const product = Product.create(
      `Test Product`,
      price ?? randomInt(1, 99999),
      stock ?? randomInt(0, 99999),
      fakeBrand,
      fakeCategory,
    );

    product.id = randomInt(1, 99999);
    return product;
  }

  /**
   * Creates an array of products for testing purposes.
   * @param quantity Number of products to create
   */
  static createMany(quantity: number): Product[] {
    const products: Product[] = [];

    for (let i = 0; i < quantity; i++) {
      const product = Product.create(
        `Product ${i + 1}`,
        randomInt(1, 99999),
        randomInt(0, 99999),
        fakeBrand,
        fakeCategory,
      );

      product.id = i + 1;
      products.push(product);
    }

    return products;
  }
}
