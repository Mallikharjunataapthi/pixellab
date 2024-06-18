import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsNotEmpty({ message: 'App is required' })
  app_id: string;
  @IsNotEmpty()
  tag_name: string;
  @IsNotEmpty()
  oldTagName: string;
}
