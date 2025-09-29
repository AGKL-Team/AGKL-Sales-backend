import { BadRequestException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandUseCase } from '../../../src/module/products/application/useCases/createBrandUseCase';
import { Brand } from '../../../src/module/products/domain/models/brand';
import { Line } from '../../../src/module/products/domain/models/line';
import { BrandService } from '../../../src/module/products/infrastructure/services/brand.service';
import { LineService } from '../../../src/module/products/infrastructure/services/line.service';
import { fakeApplicationUser } from '../../shared/fakes/user.fake';
import { CreateBrandRequest } from './../../../src/module/products/application/requests/createBrandRequest';

describe('CreateBrandUseCase', () => {
  let brandService: BrandService;
  let lineService: LineService;
  let brandRepository: Repository<Brand>;
  let lineRepository: Repository<Line>;
  let logger: Logger;
  let createBrandUseCase: CreateBrandUseCase;

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://fake-url.supabase.co';
    process.env.SUPABASE_KEY = 'fake-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        LineService,
        {
          provide: getRepositoryToken(Brand),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Line),
          useClass: Repository,
        },
        Logger,
      ],
    }).compile();

    brandRepository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
    brandService = module.get<BrandService>(BrandService);

    lineRepository = module.get<Repository<Line>>(getRepositoryToken(Line));
    lineService = module.get<LineService>(LineService);

    logger = module.get<Logger>(Logger);

    createBrandUseCase = new CreateBrandUseCase(
      brandService,
      lineService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(brandService).toBeDefined();
    expect(brandRepository).toBeDefined();
    expect(lineService).toBeDefined();
    expect(lineRepository).toBeDefined();
  });

  it('should create a brand with lines', async () => {
    // Arrange
    const user = fakeApplicationUser;
    const request: CreateBrandRequest = {
      name: 'Some Brand Valid Name',
      description: 'Some Brand Valid Description',
      lines: [
        { name: 'Some Line Valid Name 1' },
        { name: 'Some Line Valid Name 2' },
      ],
    };
    const logo = 'https://fake-url/storage/fake-logo';
    const brand = Brand.create(request.name, logo, request.description ?? '');
    request.lines.forEach((lineRequest) => {
      brand.addLine(Line.create(lineRequest.name));
    });

    jest.spyOn(brandService, 'nameIsDuplicated').mockResolvedValue(false);
    jest.spyOn(brandService, 'save').mockResolvedValue({
      ...brand,
      id: 1,
      createdAt: new Date(),
      createdBy: user.id,
    } as Brand);

    let lineCounter = 0;
    jest.spyOn(lineService, 'save').mockImplementation((line, userId) => {
      line.id = ++lineCounter; // Simulate auto-increment ID
      line.createdAt = new Date();
      line.createdBy = userId;
      return Promise.resolve(line);
    });

    // Act
    const result = await createBrandUseCase.execute(request, logo, user.id);

    // Assert
    expect(result).toBeUndefined();
    expect(brandService.nameIsDuplicated).toHaveBeenCalled();
    expect(brandService.nameIsDuplicated).toHaveBeenCalledTimes(1);
    expect(brandService.nameIsDuplicated).toHaveBeenCalledWith(request.name);
    expect(brandService.save).toHaveBeenCalled();
    expect(brandService.save).toHaveBeenCalledTimes(1);
    expect(brandService.save).toHaveBeenCalledWith(expect.any(Brand), user.id);
    expect(lineService.save).toHaveBeenCalled();
    expect(lineService.save).toHaveBeenCalledTimes(request.lines.length);
    request.lines.forEach((lineRequest) => {
      expect(lineService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: lineRequest.name,
        }),
        user.id,
      );
    });
  });

  it('should create a brand without description', async () => {
    // Arrange
    const user = fakeApplicationUser;
    const request: CreateBrandRequest = {
      name: 'Some Brand Valid Name',
      lines: [
        { name: 'Some Line Valid Name 1' },
        { name: 'Some Line Valid Name 2' },
      ],
    };
    const logo = 'https://fake-url/storage/fake-logo';
    const brand = Brand.create(request.name, logo, request.description ?? '');
    request.lines.forEach((lineRequest) => {
      brand.addLine(Line.create(lineRequest.name));
    });

    jest.spyOn(brandService, 'nameIsDuplicated').mockResolvedValue(false);
    jest.spyOn(brandService, 'save').mockResolvedValue({
      ...brand,
      id: 1,
      createdAt: new Date(),
      createdBy: user.id,
    } as Brand);

    let lineCounter = 0;
    jest.spyOn(lineService, 'save').mockImplementation((line, userId) => {
      line.id = ++lineCounter; // Simulate auto-increment ID
      line.createdAt = new Date();
      line.createdBy = userId;
      return Promise.resolve(line);
    });

    // Act
    const result = await createBrandUseCase.execute(request, logo, user.id);

    // Assert
    expect(result).toBeUndefined();
    expect(brandService.nameIsDuplicated).toHaveBeenCalled();
    expect(brandService.nameIsDuplicated).toHaveBeenCalledTimes(1);
    expect(brandService.nameIsDuplicated).toHaveBeenCalledWith(request.name);
    expect(brandService.save).toHaveBeenCalled();
    expect(brandService.save).toHaveBeenCalledTimes(1);
    expect(brandService.save).toHaveBeenCalledWith(expect.any(Brand), user.id);
    expect(lineService.save).toHaveBeenCalled();
    expect(lineService.save).toHaveBeenCalledTimes(request.lines.length);
    request.lines.forEach((lineRequest) => {
      expect(lineService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: lineRequest.name,
        }),
        user.id,
      );
    });
  });

  it('should not create a brand with a duplicated name', async () => {
    // Arrange
    const user = fakeApplicationUser;
    const request: CreateBrandRequest = {
      name: 'Some Brand Duplicated Name',
      lines: [
        { name: 'Some Line Valid Name 1' },
        { name: 'Some Line Valid Name 2' },
      ],
    };
    const logo = 'https://fake-url/storage/fake-logo';
    const brand = Brand.create(request.name, logo, request.description ?? '');
    request.lines.forEach((lineRequest) => {
      brand.addLine(Line.create(lineRequest.name));
    });

    jest.spyOn(brandService, 'nameIsDuplicated').mockResolvedValue(true);

    // Act & Assert
    await expect(
      createBrandUseCase.execute(request, logo, user.id),
    ).rejects.toThrow(BadRequestException);
    expect(brandService.nameIsDuplicated).toHaveBeenCalled();
    expect(brandService.nameIsDuplicated).toHaveBeenCalledTimes(1);
    expect(brandService.nameIsDuplicated).toHaveBeenCalledWith(request.name);
  });
});
