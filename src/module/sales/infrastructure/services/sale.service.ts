import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { SaleRepository } from '../../domain/repository/saleRepository';
import { ProductSale } from './../../domain/model/product-sale';
import { Sale } from './../../domain/model/sale';

@Injectable()
export class SaleService implements SaleRepository {
  constructor(
    @InjectRepository(Sale)
    private readonly repository: Repository<Sale>,
    @InjectRepository(ProductSale)
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

    for (const product of sale.products) {
      product.createdAt = new Date();
      product.createdBy = userId;
    }

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
    const sales = await this.repository.find({
      order: {
        number: 'DESC',
      },
      take: 1,
    });

    console.info(sales);

    const lastSale = sales[0];

    if (!lastSale) return 1;

    return lastSale.number + 1;
  }
}
