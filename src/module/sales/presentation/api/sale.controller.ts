import { Controller } from '@nestjs/common';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}
}
