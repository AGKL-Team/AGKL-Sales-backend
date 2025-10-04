import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { Repository } from 'typeorm';
import { fakeApplicationUser } from '../../shared/fakes/user.fake';
import { SupabaseTestProvider } from '../../shared/providers/supabase-config-test.provider';
import { ProductFactory } from '../providers/productsProvider';
import { Product } from './../../../src/module/products/domain/models/product';
import { ProductService } from './../../../src/module/products/infrastructure/services/product.service';

describe('ProductService', () => {
  let productRepository: Repository<Product>;

  let productService: ProductService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        SupabaseTestProvider,
      ],
    }).compile();

    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      // Arrange
      const products: Product[] = ProductFactory.createMany(randomInt(5, 60));
      jest
        .spyOn(productRepository, 'find')
        .mockImplementation(async () => await Promise.resolve(products));

      // Act
      const result = await productService.findAll({});

      // Assert
      expect(result).toBe(products);
      expect(productRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      // Arrange
      const product: Product = ProductFactory.create();
      jest
        .spyOn(productRepository, 'findOne')
        .mockImplementation(async () => await Promise.resolve(product));

      // Act
      const result = await productService.findById(product.id);

      // Assert
      expect(result).toBe(product);
      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException if product not found', async () => {
      // Arrange
      jest
        .spyOn(productRepository, 'findOne')
        .mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(productService.findById(randomInt(1, 9999))).rejects.toThrow(
        new NotFoundException(),
      );
      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('should save a product', async () => {
      // Arrange
      const product: Product = ProductFactory.create();
      const userId = fakeApplicationUser.id;
      jest
        .spyOn(productRepository, 'save')
        .mockImplementation(async () => await Promise.resolve(product));

      // Act
      const result = await productService.save(product, userId);

      // Assert
      expect(result).toBe(product);
      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(product.createdBy).toBe(userId);
      expect(product.createdAt).toBeInstanceOf(Date);
      product.images.forEach((image) => {
        expect(image.createdBy).toBe(userId);
        expect(image.createdAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      // Arrange
      const product: Product = ProductFactory.create();
      const userId = fakeApplicationUser.id;
      jest
        .spyOn(productService, 'findById')
        .mockImplementation(async () => await Promise.resolve(product));
      jest
        .spyOn(productRepository, 'save')
        .mockImplementation(async () => await Promise.resolve(product));

      // Act
      await productService.update(product, [], userId);

      // Assert
      expect(productService.findById).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      // Arrange
      const product: Product = ProductFactory.create();
      jest
        .spyOn(productService, 'findById')
        .mockImplementation(async () => await Promise.resolve(product));
      jest.spyOn(productRepository, 'save').mockImplementation(
        async () =>
          await Promise.resolve({
            ...product,
            deletedAt: new Date(),
            deletedBy: fakeApplicationUser.id,
          } as Product),
      );

      // Act
      await productService.delete(product.id, fakeApplicationUser.id);

      // Assert
      expect(productService.findById).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledWith(product);
      expect(product.deletedBy).toBe(fakeApplicationUser.id);
      expect(product.deletedAt).toBeInstanceOf(Date);
    });
  });
});
