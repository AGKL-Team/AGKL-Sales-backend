import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { Brand } from '../../domain/models/brand';
import { BrandService } from '../../infrastructure/services/brand.service';
import { CreateBrandRequest } from '../requests/createBrandRequest';
import { CloudinaryService } from './../../../cloudinary/services/cloudinary.service';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    private readonly brandService: BrandService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly logger: Logger,
  ) {}

  async execute(
    { name, description }: CreateBrandRequest,
    logo: Express.Multer.File,
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

    // 2. Upload logo
    const logoUploaded = await this.uploadLogo(logo);

    // 3. Create brand
    const brand = Brand.create(
      name,
      logoUploaded.secure_url,
      logoUploaded.public_id,
      description ?? '',
    );

    this.logger.log('Marca creada en memoria. ID: ' + brand.id);

    this.logger.log('Creando marca: ' + brand.name);

    // 4. Save brand
    await this.brandService.save(brand, userId);

    this.logger.log('Marca creada con éxito. ID: ' + brand.id);
  }

  private async uploadLogo(
    logo: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    try {
      this.logger.log('Subiendo logo a Cloudinary...');

      const response = await this.cloudinaryService.uploadImage(logo);

      this.logger.log('Logo subido con éxito. URL: ' + response.secure_url);

      return response;
    } catch (error) {
      this.logger.error(
        'Error al subir el logo a Cloudinary.\n' + error.message,
      );
      throw new BadRequestException('Error al subir el logo de la marca');
    }
  }
}
