import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UploadApiResponse } from 'cloudinary';
import { randomInt } from 'crypto';
import { Repository } from 'typeorm';
import { configureCloudinaryEnv } from '../../shared/config/cloudinary-env-config';
import { configureSupabaseEnv } from '../../shared/config/supabase-env-config';
import { fakeImage } from '../../shared/fakes/image.fake';
import { fakeApplicationUser } from '../../shared/fakes/user.fake';
import { fakeBrand } from '../fakes/brand.fake';
import { fakeCategory } from '../fakes/category.fake';
import {
  ValidCreateProductRequest,
  ValidCreateProductRequestWithCategory,
  ValidCreateProductRequestWithInitialStock,
} from '../providers/createProductRequestProvider';
import { CloudinaryModule } from './../../../src/module/cloudinary/cloudinary.module';
import { CloudinaryService } from './../../../src/module/cloudinary/services/cloudinary.service';
import { CreateProduct } from './../../../src/module/products/application/useCases/createProductUseCase';
import { Brand } from './../../../src/module/products/domain/models/brand';
import { Category } from './../../../src/module/products/domain/models/category';
import { Product } from './../../../src/module/products/domain/models/product';
import { ProductImage } from './../../../src/module/products/domain/models/productImages';
import { BrandService } from './../../../src/module/products/infrastructure/services/brand.service';
import { CategoryService } from './../../../src/module/products/infrastructure/services/category.service';
import { ProductService } from './../../../src/module/products/infrastructure/services/product.service';

describe('CreateProductUseCase', () => {
  let productRepository: Repository<Product>;
  let productService: ProductService;

  let brandService: BrandService;
  let categoryService: CategoryService;
  let cloudinaryService: CloudinaryService;

  let logger: Logger;

  let createProductUseCase: CreateProduct;

  beforeEach(async () => {
    configureSupabaseEnv();
    configureCloudinaryEnv();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CloudinaryModule],
      providers: [
        CreateProduct,
        ProductService,
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
      ],
    }).compile();

    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productService = module.get<ProductService>(ProductService);

    brandService = module.get<BrandService>(BrandService);
    categoryService = module.get<CategoryService>(CategoryService);

    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    logger = module.get<Logger>(Logger);

    createProductUseCase = new CreateProduct(
      productService,
      brandService,
      categoryService,
      cloudinaryService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(productRepository).toBeDefined();
    expect(productService).toBeDefined();
    expect(brandService).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(cloudinaryService).toBeDefined();
    expect(createProductUseCase).toBeDefined();
  });

  describe('execute', () => {
    describe('green paths', () => {
      it('should create a product without initial stock and category id', async () => {
        // Arrange
        const request = ValidCreateProductRequest();
        const quantityOfImages = randomInt(1, 5);
        const productExpected = Product.create(
          request.name,
          request.price,
          0,
          fakeBrand,
          null,
        );
        productExpected.id = randomInt(1, 99999);

        // Generate between 1 and 5 images randomly
        const images = Array.from({ length: quantityOfImages }).map(
          (_, index) => {
            return {
              ...fakeImage,
              path: `image-${index + 1}.png`,
            };
          },
        );

        const imagesUploadedResults = images.map((_, index) => {
          return {
            public_id: `fake-image-id-${index + 1}`,
            secure_url: `https://fake-url/storage/fake-image-${index + 1}`,
          };
        });

        imagesUploadedResults.forEach((img, index) => {
          const order = index + 1;
          const isPrimary = index === 0;
          const productImage = ProductImage.create(
            img.secure_url,
            img.public_id,
            `Image ${order}`,
            order,
            isPrimary,
          );
          productExpected.addImage(
            productImage.url,
            productImage.imageId,
            productImage.altText ?? '',
            productImage.order,
            productImage.isPrimary,
          );
        });

        jest.spyOn(categoryService, 'findById');
        jest.spyOn(productService, 'alreadyExists').mockResolvedValue(false);
        jest.spyOn(brandService, 'findById').mockResolvedValue(fakeBrand);
        jest
          .spyOn(cloudinaryService, 'uploadImage')
          .mockImplementation((image) => {
            const index = images.findIndex((img) => img.path === image.path);
            return Promise.resolve({
              ...imagesUploadedResults[index],
            } as UploadApiResponse);
          });
        jest
          .spyOn(productRepository, 'save')
          .mockResolvedValue(productExpected);

        // Act
        const result = await createProductUseCase.execute(
          request,
          images,
          fakeApplicationUser.id,
        );

        // Assert
        expect(result).toBeInstanceOf(Product);
        expect(result).toBeDefined();

        if (!result) {
          throw new Error('Product creation failed, result is undefined');
        }

        const productSaved: Product = result;

        expect(productSaved.id).toBeDefined();
        expect(productSaved.name).toBe(request.name);
        expect(productSaved.price).toBe(request.price);
        expect(productSaved.stock).toBe(0);

        expect(productRepository.save).toHaveBeenCalledTimes(1);
        expect(productRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            name: request.name,
            price: request.price,
            stock: 0,
            brand: fakeBrand,
            createdBy: fakeApplicationUser.id,
            createdAt: expect.any(Date),
            images: expect.any(Array),
          }),
        );
        expect(brandService.findById).toHaveBeenCalledTimes(1);
        expect(brandService.findById).toHaveBeenCalledWith(request.brandId);
        expect(categoryService.findById).not.toHaveBeenCalled();
        expect(productSaved.images.length).toEqual(
          productExpected.images.length,
        );
        images.forEach((image) => {
          expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(image);
        });
        expect(cloudinaryService.uploadImage).toHaveBeenCalledTimes(
          productExpected.images.length,
        );
      });

      it('should create a product with initial stock', async () => {
        // Arrange
        const request = ValidCreateProductRequestWithInitialStock();
        const quantityOfImages = randomInt(1, 5);
        const productExpected = Product.create(
          request.name,
          request.price,
          request.initialStock!,
          fakeBrand,
          null,
        );
        productExpected.id = randomInt(1, 99999);

        // Generate between 1 and 5 images randomly
        const images = Array.from({ length: quantityOfImages }).map(
          (_, index) => {
            return {
              ...fakeImage,
              path: `image-${index + 1}.png`,
            };
          },
        );

        const imagesUploadedResults = images.map((_, index) => {
          return {
            public_id: `fake-image-id-${index + 1}`,
            secure_url: `https://fake-url/storage/fake-image-${index + 1}`,
          };
        });

        imagesUploadedResults.forEach((img, index) => {
          const order = index + 1;
          const isPrimary = index === 0;
          const productImage = ProductImage.create(
            img.secure_url,
            img.public_id,
            `Image ${order}`,
            order,
            isPrimary,
          );
          productExpected.addImage(
            productImage.url,
            productImage.imageId,
            productImage.altText ?? '',
            productImage.order,
            productImage.isPrimary,
          );
        });

        jest.spyOn(categoryService, 'findById');
        jest.spyOn(productService, 'alreadyExists').mockResolvedValue(false);
        jest.spyOn(brandService, 'findById').mockResolvedValue(fakeBrand);
        jest
          .spyOn(cloudinaryService, 'uploadImage')
          .mockImplementation((image) => {
            const index = images.findIndex((img) => img.path === image.path);
            return Promise.resolve({
              ...imagesUploadedResults[index],
            } as UploadApiResponse);
          });
        jest
          .spyOn(productRepository, 'save')
          .mockResolvedValue(productExpected);

        // Act
        const result = await createProductUseCase.execute(
          request,
          images,
          fakeApplicationUser.id,
        );

        // Assert
        expect(result).toBeInstanceOf(Product);
        expect(result).toBeDefined();

        if (!result) {
          throw new Error('Product creation failed, result is undefined');
        }

        const productSaved: Product = result;

        expect(productSaved.id).toBeDefined();
        expect(productSaved.name).toBe(request.name);
        expect(productSaved.price).toBe(request.price);
        expect(productSaved.stock).toBe(request.initialStock!);

        expect(productRepository.save).toHaveBeenCalledTimes(1);
        expect(productRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            name: request.name,
            price: request.price,
            stock: request.initialStock,
            brand: fakeBrand,
            createdBy: fakeApplicationUser.id,
            createdAt: expect.any(Date),
            images: expect.any(Array),
          }),
        );
        expect(brandService.findById).toHaveBeenCalledTimes(1);
        expect(brandService.findById).toHaveBeenCalledWith(request.brandId);
        expect(categoryService.findById).not.toHaveBeenCalled();
        expect(productSaved.images.length).toEqual(
          productExpected.images.length,
        );
        images.forEach((image) => {
          expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(image);
        });
        expect(cloudinaryService.uploadImage).toHaveBeenCalledTimes(
          productExpected.images.length,
        );
      });

      it('should create a product with category', async () => {
        // Arrange
        const request = ValidCreateProductRequestWithCategory();
        const quantityOfImages = randomInt(1, 5);
        const productExpected = Product.create(
          request.name,
          request.price,
          0,
          fakeBrand,
          fakeCategory,
        );
        productExpected.id = randomInt(1, 99999);

        // Generate between 1 and 5 images randomly
        const images = Array.from({ length: quantityOfImages }).map(
          (_, index) => {
            return {
              ...fakeImage,
              path: `image-${index + 1}.png`,
            };
          },
        );

        const imagesUploadedResults = images.map((_, index) => {
          return {
            public_id: `fake-image-id-${index + 1}`,
            secure_url: `https://fake-url/storage/fake-image-${index + 1}`,
          };
        });

        imagesUploadedResults.forEach((img, index) => {
          const order = index + 1;
          const isPrimary = index === 0;
          const productImage = ProductImage.create(
            img.secure_url,
            img.public_id,
            `Image ${order}`,
            order,
            isPrimary,
          );
          productExpected.addImage(
            productImage.url,
            productImage.imageId,
            productImage.altText ?? '',
            productImage.order,
            productImage.isPrimary,
          );
        });

        jest.spyOn(categoryService, 'findById').mockResolvedValue(fakeCategory);
        jest.spyOn(productService, 'alreadyExists').mockResolvedValue(false);
        jest.spyOn(brandService, 'findById').mockResolvedValue(fakeBrand);
        jest
          .spyOn(cloudinaryService, 'uploadImage')
          .mockImplementation((image) => {
            const index = images.findIndex((img) => img.path === image.path);
            return Promise.resolve({
              ...imagesUploadedResults[index],
            } as UploadApiResponse);
          });
        jest
          .spyOn(productRepository, 'save')
          .mockResolvedValue(productExpected);

        // Act
        const result = await createProductUseCase.execute(
          request,
          images,
          fakeApplicationUser.id,
        );

        // Assert
        expect(result).toBeInstanceOf(Product);
        expect(result).toBeDefined();

        if (!result) {
          throw new Error('Product creation failed, result is undefined');
        }

        const productSaved: Product = result;

        expect(productSaved.id).toBeDefined();
        expect(productSaved.name).toBe(request.name);
        expect(productSaved.price).toBe(request.price);
        expect(productSaved.stock).toBe(0);

        expect(brandService.findById).toHaveBeenCalledTimes(1);
        expect(brandService.findById).toHaveBeenCalledWith(request.brandId);
        expect(categoryService.findById).toHaveBeenCalledTimes(1);
        expect(categoryService.findById).toHaveBeenCalledWith(
          request.categoryId,
        );

        expect(productRepository.save).toHaveBeenCalledTimes(1);
        expect(productRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            name: request.name,
            price: request.price,
            stock: 0,
            brand: fakeBrand,
            category: fakeCategory,
            createdBy: fakeApplicationUser.id,
            createdAt: expect.any(Date),
            images: expect.any(Array),
          }),
        );
        expect(productSaved.images.length).toEqual(
          productExpected.images.length,
        );
        images.forEach((image) => {
          expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(image);
        });
        expect(cloudinaryService.uploadImage).toHaveBeenCalledTimes(
          productExpected.images.length,
        );
      });
    });

    describe('red paths', () => {
      it('should throw BadRequestException when already exists another product with that name', async () => {
        // Arrange
        const request = ValidCreateProductRequest();
        const quantityOfImages = randomInt(1, 5);
        const images = Array.from({ length: quantityOfImages }).map(
          (_, index) => {
            return {
              ...fakeImage,
              path: `image-${index + 1}.png`,
            };
          },
        );

        jest.spyOn(productService, 'alreadyExists').mockResolvedValue(true);
        jest.spyOn(brandService, 'findById');

        // Act && Assert
        await expect(
          createProductUseCase.execute(request, images, fakeApplicationUser.id),
        ).rejects.toThrow(BadRequestException);
        expect(brandService.findById).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException when images was not provided', async () => {
        // Arrange
        const request = ValidCreateProductRequest();
        const images: Express.Multer.File[] = [];

        jest.spyOn(productService, 'alreadyExists').mockResolvedValue(false);
        jest.spyOn(brandService, 'findById');

        // Act && Assert
        await expect(
          createProductUseCase.execute(request, images, fakeApplicationUser.id),
        ).rejects.toThrow(BadRequestException);
        expect(brandService.findById).not.toHaveBeenCalled();
      });

      it('should throw NotFoundException when brand was not founded', async () => {
        // Arrange
        const request = ValidCreateProductRequest();
        const quantityOfImages = randomInt(1, 5);
        const images = Array.from({ length: quantityOfImages }).map(
          (_, index) => {
            return {
              ...fakeImage,
              path: `image-${index + 1}.png`,
            };
          },
        );

        jest.spyOn(productService, 'alreadyExists').mockResolvedValue(false);
        jest
          .spyOn(brandService, 'findById')
          .mockRejectedValue(new NotFoundException());

        // Act && Assert
        await expect(
          createProductUseCase.execute(request, images, fakeApplicationUser.id),
        ).rejects.toThrow(NotFoundException);
      });

      it('should throw NotFoundException when category was not founded', async () => {
        // Arrange
        const request = ValidCreateProductRequestWithCategory();
        const quantityOfImages = randomInt(1, 5);
        const images = Array.from({ length: quantityOfImages }).map(
          (_, index) => {
            return {
              ...fakeImage,
              path: `image-${index + 1}.png`,
            };
          },
        );

        jest.spyOn(productService, 'alreadyExists').mockResolvedValue(false);
        jest.spyOn(brandService, 'findById').mockResolvedValue(fakeBrand);
        jest
          .spyOn(categoryService, 'findById')
          .mockRejectedValue(new NotFoundException());
        jest.spyOn(cloudinaryService, 'uploadImage');

        // Act && Assert
        await expect(
          createProductUseCase.execute(request, images, fakeApplicationUser.id),
        ).rejects.toThrow(NotFoundException);
        expect(cloudinaryService.uploadImage).not.toHaveBeenCalled();
      });

      it('should throw Error when almost one image cannot be uploaded', async () => {
        // Arrange
        const request = ValidCreateProductRequest();
        const quantityOfImages = randomInt(1, 5);
        const images = Array.from({ length: quantityOfImages }).map(
          (_, index) => {
            return {
              ...fakeImage,
              path: `image-${index + 1}.png`,
            };
          },
        );

        jest.spyOn(productService, 'alreadyExists').mockResolvedValue(false);
        jest.spyOn(brandService, 'findById').mockResolvedValue(fakeBrand);
        jest
          .spyOn(cloudinaryService, 'uploadImage')
          .mockRejectedValue(new Error());
        jest.spyOn(productService, 'save');

        // Act && Assert
        await expect(
          createProductUseCase.execute(request, images, fakeApplicationUser.id),
        ).rejects.toThrow(Error);
        expect(productService.save).not.toHaveBeenCalled();
      });
    });
  });
});
