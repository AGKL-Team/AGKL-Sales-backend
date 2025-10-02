import { BadRequestException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryModule } from '../../../src/module/cloudinary/cloudinary.module';
import { CloudinaryService } from '../../../src/module/cloudinary/services/cloudinary.service';
import { CreateBrandUseCase } from '../../../src/module/products/application/useCases/createBrandUseCase';
import { Brand } from '../../../src/module/products/domain/models/brand';
import { Line } from '../../../src/module/products/domain/models/line';
import { BrandService } from '../../../src/module/products/infrastructure/services/brand.service';
import { fakeImage } from '../../shared/fakes/image.fake';
import { fakeApplicationUser } from '../../shared/fakes/user.fake';
import { CreateBrandRequest } from './../../../src/module/products/application/requests/createBrandRequest';

describe('CreateBrandUseCase', () => {
  let brandService: BrandService;
  let brandRepository: Repository<Brand>;
  let cloudinaryService: CloudinaryService;
  let logger: Logger;
  let createBrandUseCase: CreateBrandUseCase;

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://fake-url.supabase.co';
    process.env.SUPABASE_KEY = 'fake-key';
    process.env.CLOUDINARY_CLOUD_NAME = 'fake-cloud-name';
    process.env.CLOUDINARY_API_KEY = 'fake-api-key';
    process.env.CLOUDINARY_API_SECRET = 'fake-api-secret';

    const module: TestingModule = await Test.createTestingModule({
      imports: [CloudinaryModule],
      providers: [
        BrandService,
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

    logger = module.get<Logger>(Logger);

    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);

    createBrandUseCase = new CreateBrandUseCase(
      brandService,
      cloudinaryService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(brandService).toBeDefined();
    expect(brandRepository).toBeDefined();
    expect(cloudinaryService).toBeDefined();
    expect(logger).toBeDefined();
    expect(createBrandUseCase).toBeDefined();
  });

  it('should create a brand with lines', async () => {
    // Arrange
    const user = fakeApplicationUser;
    const request: CreateBrandRequest = {
      name: 'Some Brand Valid Name',
      description: 'Some Brand Valid Description',
    };
    const logo: Express.Multer.File = fakeImage;
    const logoUrl = 'https://fake-url/storage/fake-logo';
    const logoId = 'fake-logo-id';
    const brand = Brand.create(
      request.name,
      logoUrl,
      logoId,
      request.description ?? '',
    );

    jest.spyOn(brandService, 'nameIsDuplicated').mockResolvedValue(false);
    jest.spyOn(brandService, 'save').mockResolvedValue({
      ...brand,
      id: 1,
      createdAt: new Date(),
      createdBy: user.id,
    } as Brand);
    jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
      public_id: logoId,
      secure_url: logoUrl,
    } as any);

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
    expect(cloudinaryService.uploadImage).toHaveBeenCalled();
    expect(cloudinaryService.uploadImage).toHaveBeenCalledTimes(1);
    expect(cloudinaryService.uploadImage).toHaveBeenCalledWith({
      ...logo,
    });
  });

  it('should create a brand without description', async () => {
    // Arrange
    const user = fakeApplicationUser;
    const request: CreateBrandRequest = {
      name: 'Some Brand Valid Name',
    };
    const logo = fakeImage;
    const logoUrl = 'https://fake-url/storage/fake-logo';
    const logoId = 'fake-logo-id';

    const brand = Brand.create(
      request.name,
      logoUrl,
      logoId,
      request.description ?? '',
    );

    jest.spyOn(brandService, 'nameIsDuplicated').mockResolvedValue(false);
    jest.spyOn(brandService, 'save').mockResolvedValue({
      ...brand,
      id: 1,
      createdAt: new Date(),
      createdBy: user.id,
    } as Brand);
    jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
      public_id: logoId,
      secure_url: logoUrl,
    } as any);

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
    expect(cloudinaryService.uploadImage).toHaveBeenCalled();
    expect(cloudinaryService.uploadImage).toHaveBeenCalledTimes(1);
    expect(cloudinaryService.uploadImage).toHaveBeenCalledWith({
      ...logo,
    });
  });

  it('should not create a brand with a duplicated name', async () => {
    // Arrange
    const user = fakeApplicationUser;
    const request: CreateBrandRequest = {
      name: 'Some Brand Duplicated Name',
    };
    const logo = fakeImage;

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
