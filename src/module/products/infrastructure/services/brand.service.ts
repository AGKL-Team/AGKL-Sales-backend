import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Brand } from '../../domain/models/brand';
import { BrandRepository } from '../../domain/repositories/brandRepository';

@Injectable()
export class BrandService implements BrandRepository {
  constructor(
    @InjectRepository(Brand)
    private readonly repository: Repository<Brand>,
  ) {}

  findAll(): Promise<Brand[]> {
    return this.repository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  async findById(brandId: number): Promise<Brand> {
    const brand = await this.repository.findOne({
      where: {
        id: brandId,
        deletedAt: IsNull(),
      },
    });

    if (!brand) {
      throw new NotFoundException('No se encontró la marca');
    }

    return brand;
  }

  async save(brand: Brand, userId: string): Promise<Brand> {
    brand.createdAt = new Date();
    brand.createdBy = userId;

    return await this.repository.save(brand);
  }

  async update(brand: Brand, userId: string): Promise<Brand> {
    brand.updatedAt = new Date();
    brand.updatedBy = userId;

    return await this.repository.save(brand);
  }

  async delete(id: number, userId: string): Promise<void> {
    const brand = await this.findById(id);

    if (!brand) {
      throw new NotFoundException('No se encuentra la Marca');
    }

    brand.deletedAt = new Date();
    brand.deletedBy = userId;

    await this.repository.save(brand);
  }

  async nameIsDuplicated(name: string): Promise<boolean> {
    const brand = await this.repository.findOne({
      where: {
        name,
      },
    });

    return !!brand;
  }
}
