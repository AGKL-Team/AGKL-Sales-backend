import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { CreateSaleProductsRequest } from './createSaleProductsRequest';

export class CreateSaleRequest {
  @IsNumber()
  customerId: number;
  @IsNumber()
  totalAmount: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleProductsRequest)
  products: CreateSaleProductsRequest[];
}
