import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Brand } from '../../domain/models/brand';
import { BrandRepository } from '../../domain/repositories/brandRepository';

@Injectable()
export class BrandService implements BrandRepository {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  findAll(): Promise<Brand[]> {
    return this.brandRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  findById(brandId: number): Promise<Brand | null> {
    return this.brandRepository.findOne({
      where: {
        id: brandId,
        deletedAt: IsNull(),
      },
    });
  }

  async save(brand: Brand, userId: string): Promise<Brand> {
    brand.createdAt = new Date();
    brand.createdBy = userId;

    return await this.brandRepository.save(brand);
  }

  async update(brand: Brand, userId: string): Promise<Brand> {
    brand.updatedAt = new Date();
    brand.updatedBy = userId;

    return await this.brandRepository.save(brand);
  }

  async delete(id: number, userId: string): Promise<void> {
    const brand = await this.findById(id);

    if (!brand) {
      throw new BadRequestException('No se encuentra la Marca');
    }

    brand.deletedAt = new Date();
    brand.deletedBy = userId;

    await this.update(brand, userId);
  }
}
