export class CreateSaleProductsRequest {
  productId: number;
  quantity: number;
  /** Represents the price of the product */
  unitPrice: number;
  /** Represents the tax applied to the product (IVA) */
  unitTax: number;
}
