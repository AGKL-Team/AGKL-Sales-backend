import {
  Body,
  Controller,
  Delete,
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
import { UserFromRequest } from './../../../core/auth/infrastructure/decorators/user.decorator';
import { SupabaseAuthGuard } from './../../../core/auth/infrastructure/guard/supabase-auth.guard';
import { CreateCustomerRequest } from './../../application/requests/createCustomerRequest';
import { CreateCustomer } from './../../application/useCases/createCustomerUseCase';
import { UpdateCustomer } from './../../application/useCases/updateCustomerUseCase';
import { CustomerService } from './../../infrastructure/services/customer.service';

@Controller('customers')
@UseGuards(SupabaseAuthGuard)
export class CustomerController {
  constructor(
    private readonly createCustomer: CreateCustomer,
    private readonly updateCustomer: UpdateCustomer,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() request: CreateCustomerRequest,
    @UserFromRequest() user: User,
  ) {
    await this.createCustomer.execute(request, user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
  ) {
    return this.customerService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
    @Body() body: Partial<CreateCustomerRequest>,
    @UserFromRequest() user: User,
  ) {
    await this.updateCustomer.execute(id, body, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
    @UserFromRequest() user: User,
  ) {
    await this.customerService.delete(id, user.id);
  }
}
