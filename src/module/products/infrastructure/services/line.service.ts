import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LineRepository } from '../../domain/repositories/lineRepository';
import { Line } from '..//../domain/models/line';

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

  async findById(id: number): Promise<Line> {
    const line = await this.lineRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!line) {
      throw new NotFoundException('No se encuentra la Línea');
    }

    return line;
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

    await this.lineRepository.save(line);
  }

  async alreadyExistsLineByBrand(
    name: string,
    brandId: number,
  ): Promise<boolean> {
    const line = await this.lineRepository.findOne({
      where: {
        name,
        brandId,
        deletedAt: IsNull(),
      },
    });
    return !!line;
  }
}
