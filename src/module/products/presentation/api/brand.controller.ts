import {
  BadRequestException,
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
import { UserFromRequest } from '../../../auth/infrastructure/decorators/user.decorator';
import { CreateBrandRequest } from '../../application/requests/createBrandRequest';
import { CreateBrandUseCase } from '../../application/useCases/createBrandUseCase';
import { SupabaseAuthGuard } from './../../../auth/infrastructure/guard/supbase-auth.guard';
import { BrandService } from './../../infrastructure/services/brand.service';

@Controller('brands')
export class BrandController {
  constructor(
    private readonly service: BrandService,
    private readonly createBrand: CreateBrandUseCase,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async getAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async getById(@Param('id') id: string) {
    const brandId: number = parseInt(id);

    if (!brandId || isNaN(brandId)) {
      throw new BadRequestException('Id inválido');
    }

    return await this.service.findById(brandId);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SupabaseAuthGuard)
  async save(
    @Body(ValidationPipe) request: CreateBrandRequest,
    @UserFromRequest() user: User,
  ) {
    return await this.createBrand.execute(request, user.id);
  }
}
