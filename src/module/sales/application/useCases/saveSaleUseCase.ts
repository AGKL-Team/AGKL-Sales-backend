import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaleRequest } from '../requests/createSaleRequest';
import { Product } from './../../../products/domain/models/product';
import { ProductService } from './../../../products/infrastructure/services/product.service';
import { ProductSale } from './../../domain/model/product-sale';
import { Sale } from './../../domain/model/sale';
import { SaleService } from './../../infrastructure/services/sale.service';

@Injectable()
export class SaveSale {
  constructor(
    private readonly saleService: SaleService,
    private readonly productService: ProductService,
  ) {}

  async execute(request: CreateSaleRequest, userId: string) {
    // 1. Get the next number
    const nextNumber = await this.saleService.getNextNumber();

    // 2. Get every product associate to sale
    const products: ProductSale[] = [];
    for (const item of request.products) {
      const product: Product = await this.productService.findById(
        item.productId,
      );

      const productSale = ProductSale.create(product, item.quantity);
      products.push(productSale);
    }

    // 3. Create the sale
    const sale = Sale.create(nextNumber, new Date());

    // 4. Associates the items to sale
    for (const item of products) {
      sale.addProduct(item.product, item.quantity);
    }

    // 5. Ensure the items was assigned and has a product
    if (sale.products.some((i) => !i.sale || !i.product)) {
      throw new BadRequestException(
        'Ocurrió un error al asignar los detalles de la venta',
      );
    }

    await this.saleService.save(sale, userId);
  }
}
