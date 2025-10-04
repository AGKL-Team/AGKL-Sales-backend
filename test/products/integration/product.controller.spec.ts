import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { Repository } from 'typeorm';
import { configureSupabaseEnv } from '../../shared/config/supabase-env-config';
import { fakeImage } from '../../shared/fakes/image.fake';
import { fakeApplicationUser } from '../../shared/fakes/user.fake';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';
import { ValidCreateProductRequest } from '../providers/createProductRequestProvider';
import { ProductFactory } from '../providers/productsProvider';
import { CloudinaryModule } from './../../../src/module/cloudinary/cloudinary.module';
import { CreateProduct } from './../../../src/module/products/application/useCases/createProductUseCase';
import { Brand } from './../../../src/module/products/domain/models/brand';
import { Category } from './../../../src/module/products/domain/models/category';
import { Product } from './../../../src/module/products/domain/models/product';
import { BrandService } from './../../../src/module/products/infrastructure/services/brand.service';
import { CategoryService } from './../../../src/module/products/infrastructure/services/category.service';
import { ProductService } from './../../../src/module/products/infrastructure/services/product.service';
import { ProductController } from './../../../src/module/products/presentation/api/product.controller';
import { configureCloudinaryEnv } from './../../shared/config/cloudinary-env-config';

describe('ProductController', () => {
  let service: ProductService;
  let createProduct: CreateProduct;

  let controller: ProductController;

  beforeEach(async () => {
    configureSupabaseEnv();
    configureCloudinaryEnv();

    const module = await Test.createTestingModule({
      imports: [CloudinaryModule],
      controllers: [ProductController],
      providers: [
        ProductService,
        CreateProduct,
        BrandService,
        CategoryService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Brand),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        Logger,
        SupabaseTestProvider,
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    createProduct = module.get<CreateProduct>(CreateProduct);

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(createProduct).toBeDefined();
  });

  describe('save', () => {
    it('should save a product', async () => {
      // Arrange
      const request = ValidCreateProductRequest();
      const quantityImages = randomInt(1, 5);
      const images: Express.Multer.File[] = Array.from({
        length: quantityImages,
      }).map((_, index) => {
        const image = fakeImage;
        image.path = `image${index}.jpg`;
        return image;
      });
      const product = ProductFactory.create(
        request.price,
        request.initialStock,
      );

      jest.spyOn(controller, 'save');
      jest.spyOn(createProduct, 'execute').mockResolvedValue(product);

      // Act
      await controller.save(request, images, fakeApplicationUser);

      // Assert
      expect(controller.save).toHaveBeenCalled();
      expect(controller.save).toHaveBeenCalledWith(
        request,
        images,
        fakeApplicationUser,
      );
      expect(createProduct.execute).toHaveBeenCalled();
      expect(createProduct.execute).toHaveBeenCalledTimes(1);
    });
  });
});
