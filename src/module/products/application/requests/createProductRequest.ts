import { Type } from 'class-transformer';
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
  @MinLength(3, {
    message: 'El nombre del producto debe tener al menos 3 caracteres',
  })
  @MaxLength(50, {
    message: 'El nombre del producto no debe exceder los 50 caracteres',
  })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La descripción no debe exceder los 255 caracteres',
  })
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1, {
    message: 'El código de marca debe ser un número positivo',
  })
  brandId: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1, {
    message: 'El código de categoría debe ser un número positivo',
  })
  categoryId?: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1, {
    message: 'El precio debe ser un número positivo',
  })
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1, {
    message: 'El stock inicial debe ser un número positivo o cero',
  })
  initialStock?: number;
}
