import { CreateBrandUseCase } from '../application/useCases/createBrandUseCase';
import { UpdateBrandUseCase } from '../application/useCases/updateBrandUseCase';

export const BrandUseCases = [CreateBrandUseCase, UpdateBrandUseCase];

export const ProductUseCases = [];

export const ProductModuleUseCases = [...BrandUseCases, ...ProductUseCases];
