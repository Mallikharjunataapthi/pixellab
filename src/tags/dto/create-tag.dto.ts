import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: 'App is required' })
  @IsString({ message: 'App must be a string' })
  app_id: string;
  @IsNotEmpty({ message: 'Tag name Required' })
  @IsString({ message: 'Tag Must be a String' })
  tag_name: string;
  @IsNotEmpty()
  is_active: string;
}
