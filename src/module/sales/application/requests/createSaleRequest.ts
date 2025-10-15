import { CreateSaleProductsRequest } from './createSaleProductsRequest';

export class CreateSaleRequest {
  customerId: string;
  sellerId: string;
  products: CreateSaleProductsRequest[];
  totalAmount: number;
  date: Date;
}
