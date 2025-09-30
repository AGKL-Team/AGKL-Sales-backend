import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { UpdateLineUseCase } from 'module/products/application/useCases/updateLineUseCase';
import { UserFromRequest } from '../../../core/auth/infrastructure/decorators/user.decorator';
import { SupabaseAuthGuard } from '../../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreateLineRequest } from '../../application/requests/createLineRequest';
import { CreateLineUseCase } from '../../application/useCases/createLineUseCase';
import { LineService } from '../../infrastructure/services/line.service';

@Controller('lines')
export class LineController {
  constructor(
    private readonly service: LineService,
    private readonly createLine: CreateLineUseCase,
    private readonly updateLine: UpdateLineUseCase,
  ) {}

  @Get('brand/:brandId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async getAll(
    @Param('brandId', new ValidationPipe({ transform: true })) brandId: number,
  ) {
    return await this.service.findAllForBrand(brandId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async getById(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
  ) {
    return await this.service.findById(id);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SupabaseAuthGuard)
  async save(
    @Body(ValidationPipe) request: CreateLineRequest,
    @UserFromRequest() user: User,
  ) {
    const { name, brandId } = request;

    if (!brandId) {
      throw new BadRequestException('El ID de la marca es obligatorio');
    }

    return await this.createLine.execute({ name, brandId }, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  async update(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
    @Body(ValidationPipe) name: string,
    @UserFromRequest() user: User,
  ) {
    return await this.updateLine.execute(id, name, user.id);
  }
}
