import { Optional } from '@nestjs/common';
import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateProductRequest {
  @IsString()
  @Optional()
  @MinLength(3, {
    message: 'El nombre del producto debe tener al menos 3 caracteres',
  })
  @MaxLength(50, {
    message: 'El nombre del producto no debe exceder los 50 caracteres',
  })
  name?: string;

  @IsString()
  @Optional()
  @MaxLength(255, {
    message: 'La descripción no debe exceder los 255 caracteres',
  })
  description?: string;

  @IsNumber()
  @Optional()
  @Min(0, {
    message: 'El precio debe ser un número positivo',
  })
  price?: number;

  @IsNumber()
  @Optional()
  @Min(1, {
    message: 'El código de marca debe ser un número positivo',
  })
  brandId?: number;

  @IsNumber()
  @Optional()
  @Min(1, {
    message: 'El código de categoría debe ser un número positivo',
  })
  categoryId?: number;

  /**
   * List of URLs of images to be removed from the product
   */
  @IsString({ each: true })
  @Optional()
  imagesToRemove?: string[];
}
