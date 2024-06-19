import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateUserContactDto {
  @IsNotEmpty({ message: 'App is required' })
  @IsString({ message: 'App must be a string' })
  readonly username: string;
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  readonly email: string;
  @IsNotEmpty({ message: 'Message is required' })
  @IsString({ message: 'Message must be a string' })
  readonly message: string;
  @IsNotEmpty({ message: 'webname is required' })
  @IsString({ message: 'webname must be a string' })
  readonly webname: string;
}
