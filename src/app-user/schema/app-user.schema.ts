import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class AppUser {
  @Prop({
    type: Types.ObjectId,
    ref: 'Apps',
  })
  app_id: Types.ObjectId;

  @Prop({ required: true, unique: false })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  app_name: string;

  @Prop({ required: true })
  profile_img: string;

  @Prop({ required: true, default: 2 })
  role_id: string;

  @Prop({ required: true, enum: ['1', '0'], default: '1' })
  is_active: string;
}

export type AppUserDocument = AppUser & Document;
export const AppUserSchema = SchemaFactory.createForClass(AppUser);
