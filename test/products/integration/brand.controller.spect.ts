import { Test } from '@nestjs/testing';
import { Brand } from '../../../src/module/products/domain/models/brand';
import { BrandService } from '../../../src/module/products/infrastructure/services/brand.service';
import { BrandController } from '../../../src/module/products/presentation/api/brand.controller';

describe('BrandController', () => {
  let controller: BrandController;

  let service: BrandService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BrandService],
      controllers: [BrandController],
    }).compile();

    controller = module.get<BrandController>(BrandController);
    service = module.get<BrandService>(BrandService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
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
});
