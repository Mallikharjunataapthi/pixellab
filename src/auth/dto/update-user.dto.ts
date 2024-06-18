import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateUserDto {
  @IsNotEmpty({ message: 'User name is required' })
  @IsString({ message: 'User name must be a string' })
  username: string;
  @IsOptional()
  password: string;
  email: string;
  app_id: Types.ObjectId;
  role_id: string;
  is_active: string;
  profile_img?: string;
}
