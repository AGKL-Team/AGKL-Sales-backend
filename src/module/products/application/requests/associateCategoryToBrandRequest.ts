import { IsNumber } from 'class-validator';

export class AssociateCategoryToBrandRequest {
  @IsNumber()
  categoryId: number;

  @IsNumber()
  brandId: number;
}
