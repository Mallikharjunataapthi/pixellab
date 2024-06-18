import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateLikeDto {
  @ApiProperty({ name: 'user_id', type: String })
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @ApiProperty({ name: 'template_id', type: String })
  @IsNotEmpty()
  template_id: Types.ObjectId;

  @ApiProperty({ name: 'app_id', type: String })
  @IsNotEmpty()
  app_id: Types.ObjectId;
}
