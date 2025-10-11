import { BadRequestException, Injectable } from '@nestjs/common';
import { SaleService } from '../../../sales/infrastructure/services/sale.service';
import { ProductService } from '../../infrastructure/services/product.service';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly saleService: SaleService,
  ) {}

  async execute(productId: number, userId: string) {
    // 1. Ensure the product exists
    await this.productService.findById(productId);

    // 2. Check if the product is associated with any sales
    const isProductInSales = await this.saleService.isProductInSales(productId);
    if (isProductInSales) {
      throw new BadRequestException(
        'Cannot delete product because it is associated with existing sales.',
      );
    }

    // 3. Proceed to delete the product
    await this.productService.delete(productId, userId);
  }
}
