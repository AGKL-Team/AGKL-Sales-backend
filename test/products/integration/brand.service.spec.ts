import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { SupabaseService } from '../../../src/module/core/database/services/supabase.service';
import { BrandService } from '../../../src/module/products/infrastructure/services/brand.service';
import { ConfigTestProvider } from '../../shared/providers/config-test.provider';
import { Brand } from './../../../src/module/products/domain/models/brand';

describe('BrandService', () => {
  let service: BrandService;
  let brandRepository: Repository<Brand>;

  // Definir fuera del beforeEach para mantener la referencia
  const supabaseClient = {
    from: jest.fn(),
    select: jest.fn(),
    eq: jest.fn(),
    single: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const supabaseService = {
    getClient: jest.fn().mockReturnValue(supabaseClient),
    handleError: jest.fn(),
  } as any;

  beforeEach(async () => {
    // Limpiar mocks antes de cada test
    supabaseClient.from.mockReset();
    supabaseClient.select.mockReset();
    supabaseClient.eq.mockReset();
    supabaseClient.single.mockReset();
    supabaseClient.insert.mockReset();
    supabaseClient.update.mockReset();
    supabaseClient.delete.mockReset();
    supabaseService.getClient.mockClear();

    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BrandService,
        { provide: getRepositoryToken(Brand), useClass: Repository },
        { provide: SupabaseService, useValue: supabaseService },
        ConfigTestProvider,
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    brandRepository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of brands', async () => {
      // Arrange
      const expectedBrands: Brand[] = [
        Brand.create('Brand 1', 'logo1.png', 'logo1_id', 'Description 1'),
        Brand.create('Brand 2', 'logo2.png', 'logo2_id', 'Description 2'),
      ];

      jest.spyOn(brandRepository, 'find').mockResolvedValue(expectedBrands);

      // Act
      const brands = await service.findAll();

      // Assert
      expect(brands).toEqual(expectedBrands);
      expect(brandRepository.find).toHaveBeenCalled();
      expect(brandRepository.find).toHaveBeenCalledTimes(1);
      expect(brandRepository.find).toHaveBeenCalledWith({
        where: {
          deletedAt: IsNull(),
        },
      });
    });
  });

  describe('findById', () => {});
});
