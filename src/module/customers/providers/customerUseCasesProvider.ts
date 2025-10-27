import { CreateCustomer } from '../application/useCases/createCustomerUseCase';
import { UpdateCustomer } from '../application/useCases/updateCustomerUseCase';

export const CUSTOMER_USE_CASES = [CreateCustomer, UpdateCustomer];
