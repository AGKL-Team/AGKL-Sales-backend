import { BadRequestException, Injectable } from '@nestjs/common';
import { Brand } from '../../domain/models/brand';
import { Line } from '../../domain/models/line';
import { BrandService } from '../../infrastructure/services/brand.service';
import { LineService } from '../../infrastructure/services/line.service';
import { CreateBrandRequest } from '../requests/createBrandRequest';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    private readonly brandService: BrandService,
    private readonly lineService: LineService,
  ) {}

  async execute(
    { name, description, lines }: CreateBrandRequest,
    userId: string,
  ) {
    // 1. Ensure the name not exists
    if (await this.brandService.nameIsDuplicated(name)) {
      throw new BadRequestException(
        'Ya existe una Marca registrada con el nombre ' + name,
      );
    }

    // 2. Save brand
    const brand = Brand.create(name, description ?? '');
    lines.forEach((lineRequest) => {
      brand.addLine(Line.create(lineRequest.name));
    });

    await this.brandService.save(brand, userId);

    // 3. Save lines
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    brand.lines.forEach(async (line) => {
      await this.lineService.save(line, userId);
    });
  }
}
