import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly app_id: string;
  readonly username: string;
  @IsOptional()
  readonly password: string;
  readonly role_id: string;
  readonly is_active: string;
  readonly email: string;
  readonly profile_img?: string;
}
