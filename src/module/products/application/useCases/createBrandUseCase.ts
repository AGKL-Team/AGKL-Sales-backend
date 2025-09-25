import { BadRequestException, Injectable } from '@nestjs/common';
import { Brand } from '../../domain/models/brand';
import { Line } from '../../domain/models/line';
import { BrandRepository } from '../../domain/repositories/brandRepository';
import { LineRepository } from '../../domain/repositories/lineRepository';
import { CreateBrandRequest } from '../requests/createBrandRequest';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly lineRepository: LineRepository,
  ) {}

  async execute(request: CreateBrandRequest, userId: string) {
    // 1. Ensure the name not exists
    if (await this.brandRepository.nameIsDuplicated(request.name)) {
      throw new BadRequestException(
        'Ya existe una Marca registrada con el nombre ' + request.name,
      );
    }

    // 2. Save brand
    const brand = Brand.create(request.name, request.description ?? '');
    request.lines.forEach((lineRequest) => {
      brand.addLine(Line.create(lineRequest.name));
    });

    await this.brandRepository.save(brand, userId);

    // 3. Save lines
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    brand.lines.forEach(async (line) => {
      await this.lineRepository.save(line, userId);
    });
  }
}
