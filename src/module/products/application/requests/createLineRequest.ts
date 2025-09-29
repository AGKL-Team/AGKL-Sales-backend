import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateLineRequest {
  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(30)
  name: string;

  @IsNumber()
  @Min(1)
  brandId?: number;
}
