import { AssociateCategoryToBrand } from '../application/useCases/associateCategoryToBrandUseCase';
import { CreateBrandUseCase } from '../application/useCases/createBrandUseCase';
import { CreateCategory } from '../application/useCases/createCategoryUseCase';
import { CreateProduct } from '../application/useCases/createProductUseCase';
import { DeleteProductImages } from '../application/useCases/deleteProductImagesUseCase';
import { UpdateBrandUseCase } from '../application/useCases/updateBrandUseCase';
import { UpdateCategory } from '../application/useCases/updateCategoryUseCase';
import { UpdateProduct } from '../application/useCases/updateProductUseCase';
import { UploadProductImages } from '../application/useCases/uploadProductImagesUseCase';

export const BrandUseCases = [CreateBrandUseCase, UpdateBrandUseCase];

export const CategoryUseCases = [
  CreateCategory,
  UpdateCategory,
  AssociateCategoryToBrand,
];

export const ProductUseCases = [
  CreateProduct,
  UpdateProduct,
  UploadProductImages,
  DeleteProductImages,
];

export const ProductModuleUseCases = [
  ...BrandUseCases,
  ...CategoryUseCases,
  ...ProductUseCases,
];
