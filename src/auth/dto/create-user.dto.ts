import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class CreateUserDto {
  @IsNotEmpty({ message: 'User name is required' })
  @IsString({ message: 'User name must be a string' })
  readonly username: string;
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
  email: string;
  app_id: Types.ObjectId;
}
