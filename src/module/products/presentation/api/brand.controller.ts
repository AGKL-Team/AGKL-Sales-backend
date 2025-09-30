import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@supabase/supabase-js';
import { UpdateBrandRequest } from 'module/products/application/requests/updateBrandRequest';
import { UpdateBrandUseCase } from 'module/products/application/useCases/updateBrandUseCase';
import { memoryStorage } from 'multer';
import { UserFromRequest } from '../../../core/auth/infrastructure/decorators/user.decorator';
import { CreateBrandRequest } from '../../application/requests/createBrandRequest';
import { CreateBrandUseCase } from '../../application/useCases/createBrandUseCase';
import { SupabaseAuthGuard } from './../../../core/auth/infrastructure/guard/supabase-auth.guard';
import { BrandService } from './../../infrastructure/services/brand.service';

@Controller('brands')
export class BrandController {
  constructor(
    private readonly service: BrandService,
    private readonly createBrand: CreateBrandUseCase,
    private readonly updateBrand: UpdateBrandUseCase,
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
  @UseInterceptors(FileInterceptor('logo', { storage: memoryStorage() }))
  async save(
    @Body(ValidationPipe) request: CreateBrandRequest,
    @UploadedFile() logo: Express.Multer.File,
    @UserFromRequest() user: User,
  ) {
    return await this.createBrand.execute(request, logo, user.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) request: UpdateBrandRequest,
    @UserFromRequest() user: User,
  ) {
    const brandId: number = parseInt(id);

    if (!brandId || isNaN(brandId)) {
      throw new BadRequestException('Id inválido');
    }

    const { name, description } = request;

    return await this.updateBrand.execute(brandId, user.id, name, description);
  }
}
