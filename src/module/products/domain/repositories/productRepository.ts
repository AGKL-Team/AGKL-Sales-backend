import { UploadApiResponse } from 'cloudinary';
import { ProductFilters } from '../interfaces/productFilters';
import { Product } from '../models/product';

export interface ProductRepository {
  /**
   * Fetches all products based on provided filters.
   * @param filters - Object containing filter criteria
   * @returns Promise that resolves to an array of Product entities
   */
  findAll(filters: ProductFilters): Promise<Product[]>;

  /**
   * Fetches a product by its unique identifier.
   * @param id - Unique identifier of the product
   * @returns Promise that resolves to the Product entity or null if not found
   */
  findById(id: number): Promise<Product | null>;

  /**
   * Saves a new product.
   * @param product - Product entity to be saved
   * @param files - Array of image files associated with the product
   * @param userId - Unique identifier of the user performing the action
   * @returns Promise that resolves when the product is saved
   */
  save(
    product: Product,
    files: UploadApiResponse[],
    userId: string,
  ): Promise<void>;

  /**
   * Updates an existing product.
   * @param product - Product entity with updated information
   * @param files - Array of new image files to be added to the product
   * @param userId - Unique identifier of the user performing the action
   * @returns Promise that resolves when the product is updated
   */
  update(
    product: Product,
    files: UploadApiResponse[],
    userId: string,
  ): Promise<void>;

  /**
   * Deletes a product by its unique identifier.
   * @param id - Unique identifier of the product to be deleted
   * @param userId - Unique identifier of the user performing the action
   * @returns Promise that resolves when the product is deleted
   */
  delete(id: number, userId: string): Promise<void>;

  /**
   * Fetches all products belonging to a specific category based on provided filters.
   * @param filters - Object containing filter criteria
   * @returns Promise that resolves to an array of Product entities
   */
  findAllByCategory(filters: ProductFilters): Promise<Product[]>;

  /**
   * Fetches all products belonging to a specific brand based on provided filters.
   * @param filters - Object containing filter criteria
   * @returns Promise that resolves to an array of Product entities
   */
  findAllByBrand(filters: ProductFilters): Promise<Product[]>;

  /**
   * Fetches all products belonging to a specific line based on provided filters.
   * @param filters - Object containing filter criteria
   * @returns Promise that resolves to an array of Product entities
   */
  findAllByLine(filters: ProductFilters): Promise<Product[]>;
}
