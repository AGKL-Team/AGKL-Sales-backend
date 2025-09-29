import { Injectable } from '@nestjs/common';
import { BrandService } from '../../infrastructure/services/brand.service';

@Injectable()
export class UpdateBrandUseCase {
  constructor(private readonly service: BrandService) {}

  async execute(
    brandId: number,
    userId: string,
    name?: string,
    description?: string,
  ) {
    // 1. Ensure the brand exists
    const brand = await this.service.findById(brandId);

    // 2. Update the brand details if provided
    if (name) brand.changeName(name);
    if (description) brand.changeDescription(description);

    // 3. Save the updated brand
    return await this.service.update(brand, userId);
  }
}
