import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, {
    message: 'El código de marca debe ser un número positivo',
  })
  brandId: number;

  @IsNumber()
  @IsOptional()
  @Min(1, {
    message: 'El código de categoría debe ser un número positivo',
  })
  categoryId?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, {
    message: 'El precio debe ser un número positivo',
  })
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0, {
    message: 'El stock inicial debe ser un número positivo o cero',
  })
  initialStock?: number;
}
