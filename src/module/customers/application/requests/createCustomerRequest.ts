import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;
}
