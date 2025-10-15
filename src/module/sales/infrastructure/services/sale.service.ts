import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { SaleRepository } from '../../domain/repository/saleRepository';
import { ProductSale } from './../../domain/model/product-sale';
import { Sale } from './../../domain/model/sale';

@Injectable()
export class SaleService implements SaleRepository {
  constructor(
    private readonly repository: Repository<Sale>,
    private readonly productSaleRepository: Repository<ProductSale>,
  ) {}

  async findAll(): Promise<Sale[]> {
    return await this.repository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  async findById(id: number): Promise<Sale> {
    const sale = await this.repository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!sale) throw new NotFoundException('No se encuentra la venta');

    return sale;
  }

  async save(sale: Sale, userId: string): Promise<Sale> {
    sale.createdAt = new Date();
    sale.createdBy = userId;

    return await this.repository.save(sale);
  }

  async delete(id: number, userId: string): Promise<void> {
    const sale = await this.findById(id);

    sale.deletedAt = new Date();
    sale.deletedBy = userId;

    await this.repository.save(sale);
    for (const product of sale.products) {
      product.deletedAt = new Date();
      product.deletedBy = userId;
    }
    await this.productSaleRepository.save(sale.products);
  }

  async isProductInSales(productId: number): Promise<boolean> {
    const isInSales = await this.productSaleRepository.findOne({
      where: {
        productId,
      },
    });

    return !!isInSales;
  }

  async getNextNumber(): Promise<number> {
    const lastSale = await this.repository.findOne({
      order: {
        number: 'DESC',
      },
      select: ['number'],
    });

    if (!lastSale)
      throw new BadRequestException(
        'Ocurrió un error al recuperar el próximo número para la venta',
      );

    return lastSale.number + 1;
  }
}
