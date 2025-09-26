import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class UpdateBrandRequest {
  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  name?: string;

  @IsString()
  @Max(100)
  description?: string;
}
