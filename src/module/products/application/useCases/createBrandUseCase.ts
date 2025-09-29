import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
    private readonly logger: Logger,
  ) {}

  async execute(
    { name, description, lines }: CreateBrandRequest,
    logo: string,
    userId: string,
  ) {
    // 1. Ensure the name not exists
    if (await this.brandService.nameIsDuplicated(name)) {
      this.logger.error('El nombre de la marca ya existe: ' + name);
      throw new BadRequestException(
        'Ya existe una Marca registrada con el nombre ' + name,
      );
    }
    this.logger.log('El nombre de la marca es único: ' + name);

    // 2. Save brand
    const brand = Brand.create(name, logo, description ?? '');
    this.logger.log('Marca creada en memoria. ID: ' + brand.id);

    // 3. Add lines
    lines.forEach((lineRequest) => {
      this.logger.log('Agregando línea: ' + lineRequest.name);
      brand.addLine(Line.create(lineRequest.name));
      this.logger.log('Línea agregada con éxito: ' + lineRequest.name);
    });

    this.logger.log('Creando marca: ' + brand.name);

    // 4. Save brand
    await this.brandService.save(brand, userId);

    this.logger.log('Marca creada con éxito. ID: ' + brand.id);

    // 5. Save lines
    await Promise.all(
      brand.lines.map((line) => this.lineService.save(line, userId)),
    );
  }
}
