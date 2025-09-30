import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateBrandRequest {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @MaxLength(100)
  description?: string;
}
