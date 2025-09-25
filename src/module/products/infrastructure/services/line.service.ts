import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Line } from 'module/products/domain/models/line';
import { IsNull, Repository } from 'typeorm';
import { LineRepository } from '../../domain/repositories/lineRepository';

@Injectable()
export class LineService implements LineRepository {
  constructor(
    @InjectRepository(Line)
    private readonly lineRepository: Repository<Line>,
  ) {}

  async findAllForBrand(brandId: number): Promise<Line[]> {
    return await this.lineRepository.find({
      where: {
        brandId,
        deletedAt: IsNull(),
      },
    });
  }

  async findById(id: number): Promise<Line | null> {
    return await this.lineRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
  }

  async save(line: Line, userId: string): Promise<Line> {
    line.createdAt = new Date();
    line.createdBy = userId;

    return await this.lineRepository.save(line);
  }

  async update(line: Line, userId: string): Promise<Line> {
    line.updatedAt = new Date();
    line.updatedBy = userId;

    return await this.lineRepository.save(line);
  }

  async delete(id: number, userId: string): Promise<void> {
    const line = await this.findById(id);

    if (!line) {
      throw new NotFoundException('No se encuentra la Línea');
    }

    line.deletedAt = new Date();
    line.deletedBy = userId;

    await this.update(line, userId);
  }
}
