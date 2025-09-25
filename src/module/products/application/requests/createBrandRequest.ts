import { Type } from 'class-transformer';
import { IsNotEmpty, Max, Min, ValidateNested } from 'class-validator';
import { CreateLineRequest } from './createLineRequest';

export class CreateBrandRequest {
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  name: string;

  @Max(100)
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateLineRequest)
  lines: CreateLineRequest[];
}
