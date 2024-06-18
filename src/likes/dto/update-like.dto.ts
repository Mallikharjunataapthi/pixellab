import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeDto } from './create-like.dto';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
export class UpdateLikeDto extends PartialType(CreateLikeDto) {
  @IsNotEmpty()
  user_id: Types.ObjectId;
  @IsNotEmpty()
  template_id: Types.ObjectId;
}
