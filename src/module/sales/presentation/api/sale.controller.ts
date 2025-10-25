import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { UserFromRequest } from 'module/core/auth/infrastructure/decorators/user.decorator';
import { CreateSale } from '../../application/useCases/createSaleUseCase';
import { SaleService } from '../../infrastructure/services/sale.service';
import { SupabaseAuthGuard } from './../../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreateSaleRequest } from './../../application/requests/createSaleRequest';

@Controller('sales')
@UseGuards(SupabaseAuthGuard)
export class SaleController {
  constructor(
    private readonly saleService: SaleService,
    private readonly saveSale: CreateSale,
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
