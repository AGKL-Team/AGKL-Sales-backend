import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { UserFromRequest } from 'module/core/auth/infrastructure/decorators/user.decorator';
import { SaleService } from '../../infrastructure/services/sale.service';
import { CreateSaleRequest } from './../../application/requests/createSaleRequest';
import { SaveSale } from './../../application/useCases/saveSaleUseCase';

@Controller('sales')
export class SaleController {
  constructor(
    private readonly saleService: SaleService,
    private readonly saveSale: SaveSale,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.saleService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
  ) {
    return this.saleService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async save(
    @Body(ValidationPipe) request: CreateSaleRequest,
    @UserFromRequest() user: User,
  ) {
    await this.saveSale.execute(request, user.id);
  }
}
