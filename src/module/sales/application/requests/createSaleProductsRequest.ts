import { Optional } from '@nestjs/common';
import { IsNumber, Min } from 'class-validator';

export class CreateSaleProductsRequest {
  @IsNumber()
  productId: number;
  @IsNumber()
  @Min(1, {
    message: 'La cantidad debe ser un número positivo',
  })
  quantity: number;
  /** Represents the price of the product */
  @IsNumber()
  @Min(0, {
    message: 'El precio debe ser un número positivo',
  })
  unitPrice: number;
  /** Represents the tax applied to the product (IVA) */
  @IsNumber()
  @Min(0, {
    message: 'El impuesto debe ser un número positivo',
  })
  @Optional()
  unitTax?: number;
}
