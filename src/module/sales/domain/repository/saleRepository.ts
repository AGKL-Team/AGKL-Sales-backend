import { Sale } from '../model/sale';

export interface SaleRepository {
  /**
   * Finds all sales.
   * @returns A promise that resolves to an array of Sale entities.
   */
  findAll(): Promise<Sale[]>;

  /**
   * Finds a sale by its ID.
   * @param id The ID of the sale to find.
   * @returns A promise that resolves to the Sale entity, or null if not found.
   */
  findById(id: number): Promise<Sale>;

  /**
   * Saves a sale.
   * @param sale The Sale entity to be saved.
   * @returns A promise that resolves to the saved Sale entity.
   */
  save(sale: Sale, userId: string): Promise<Sale>;

  /**
   * Deletes a sale by its ID.
   * @param id The ID of the sale to delete.
   * @returns A promise that resolves when the sale is deleted.
   */
  delete(id: number, userId: string): Promise<void>;

  /**
   * Checks if a product is associated with any sales.
   * @param productId The ID of the product to check.
   * @returns A promise that resolves to true if the product is associated with any sales, otherwise false.
   */
  isProductInSales(productId: number): Promise<boolean>;
}
