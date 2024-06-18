import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  readonly app_id: string;
  @IsNotEmpty({ message: 'User Name is required' })
  @IsString()
  readonly username: string;
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
