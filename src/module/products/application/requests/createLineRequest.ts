import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateLineRequest {
  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(30)
  name: string;
}
