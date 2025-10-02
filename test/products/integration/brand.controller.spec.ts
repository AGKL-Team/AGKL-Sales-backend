import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryModule } from '../../../src/module/cloudinary/cloudinary.module';
import { CreateBrandRequest } from '../../../src/module/products/application/requests/createBrandRequest';
import { CreateBrandUseCase } from '../../../src/module/products/application/useCases/createBrandUseCase';
import { UpdateBrandUseCase } from '../../../src/module/products/application/useCases/updateBrandUseCase';
import { Brand } from '../../../src/module/products/domain/models/brand';
import { BrandService } from '../../../src/module/products/infrastructure/services/brand.service';
import { BrandController } from '../../../src/module/products/presentation/api/brand.controller';
import { fakeApplicationUser } from '../../shared/fakes/user.fake';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';

describe('BrandController', () => {
  let controller: BrandController;

  let service: BrandService;
  let createBrandUseCase: CreateBrandUseCase;

  beforeEach(async () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'fake-cloud-name';
    process.env.CLOUDINARY_API_KEY = 'fake-api-key';
    process.env.CLOUDINARY_API_SECRET = 'fake-api-secret';

    const module = await Test.createTestingModule({
      imports: [CloudinaryModule],
      providers: [
        BrandService,
        CreateBrandUseCase,
        UpdateBrandUseCase,
        { provide: getRepositoryToken(Brand), useClass: Repository },
        SupabaseTestProvider,
        Logger,
      ],
      controllers: [BrandController],
    }).compile();

    controller = module.get<BrandController>(BrandController);
    service = module.get<BrandService>(BrandService);
    createBrandUseCase = module.get<CreateBrandUseCase>(CreateBrandUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(createBrandUseCase).toBeDefined();
  });

  describe('getAll', () => {
    it('should be defined', () => {
      expect(controller.getAll).toBeDefined();
    });

    it('should return a list of brands', async () => {
      const result: Brand[] = [
        Brand.create('Brand 1', 'http://logo1.com', 'logo1'),
        Brand.create('Brand 2', 'http://logo2.com', 'logo2'),
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.getAll()).toBe(result);
    });
  });

  describe('getById', () => {
    it('should be defined', () => {
      expect(controller.getById).toBeDefined();
    });

    it('should return a brand by id', async () => {
      const brand: Brand = Brand.create('Brand 1', 'http://logo1.com', 'logo1');
      jest.spyOn(service, 'findById').mockResolvedValue(brand);

      expect(await controller.getById('1')).toBe(brand);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(controller.getById('invalid')).rejects.toThrow(
        'Id inválido',
      );
    });
  });

  describe('save', () => {
    it('should be defined', () => {
      expect(controller.save).toBeDefined();
    });

    it('should throw BadRequestException if logo is not provided', async () => {
      const request: CreateBrandRequest = {
        name: 'Brand 1',
      };
      const logo: Express.Multer.File | null = null;

      await expect(
        controller.save(request, logo!, fakeApplicationUser),
      ).rejects.toThrow('El logo es obligatorio');
    });

    it('should create a brand successfully', async () => {
      const request: CreateBrandRequest = {
        name: 'Brand 1',
      };
      const logo: Express.Multer.File | null = {
        originalname: 'logo.png',
        buffer: Buffer.from('logo'),
      } as Express.Multer.File;

      jest.spyOn(createBrandUseCase, 'execute').mockResolvedValue();

      await expect(
        controller.save(request, logo, fakeApplicationUser),
      ).resolves.not.toThrow();
    });
  });
});
