import { CreateBrandUseCase } from '../application/useCases/createBrandUseCase';
import { CreateLineUseCase } from '../application/useCases/createLineUseCase';
import { UpdateBrandUseCase } from '../application/useCases/updateBrandUseCase';
import { UpdateLineUseCase } from '../application/useCases/updateLineUseCase';

export const BrandUseCases = [CreateBrandUseCase, UpdateBrandUseCase];

export const LineUseCases = [CreateLineUseCase, UpdateLineUseCase];

export const ProductUseCases = [];

export const ProductModuleUseCases = [
  ...BrandUseCases,
  ...LineUseCases,
  ...ProductUseCases,
];
