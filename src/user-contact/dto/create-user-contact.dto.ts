import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateUserContactDto {
  @IsNotEmpty({ message: 'App is required' })
  @IsString({ message: 'App must be a string' })
  readonly username: string;
  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  readonly email: string;
  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  readonly message: string;
  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be a string' })
  readonly webname: string;
}
