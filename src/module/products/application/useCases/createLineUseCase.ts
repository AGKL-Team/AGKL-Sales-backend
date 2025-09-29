import { BadRequestException, Injectable } from '@nestjs/common';
import { Line } from '../../domain/models/line';
import { BrandService } from '../../infrastructure/services/brand.service';
import { LineService } from '../../infrastructure/services/line.service';
import { CreateLineRequest } from '../requests/createLineRequest';

@Injectable()
export class CreateLineUseCase {
  constructor(
    private readonly lineService: LineService,

    private readonly brandService: BrandService,
  ) {}

  async execute({ name, brandId }: CreateLineRequest, userId: string) {
    // 1. Ensure the brand exists
    const brand = await this.brandService.findById(brandId!);

    // 2. Ensure the name is unique within the brand
    const existingLine = await this.lineService.alreadyExistsLineByBrand(
      name,
      brandId!,
    );
    if (existingLine) {
      throw new BadRequestException(
        `La línea con nombre '${name}' ya existe para la marca ${brand.name}`,
      );
    }

    // 3. Create the line
    const line = Line.create(name);

    // 4. Associate the line with the brand
    brand.addLine(line);

    // 5. Save the line
    await this.lineService.save(line, userId);

    // 6. Return the created line
    return line;
  }
}
