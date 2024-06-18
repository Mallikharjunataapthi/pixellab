import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: Types.ObjectId,
    ref: 'Apps',
  })
  app_id: Types.ObjectId;
  @Prop({ required: false })
  app_name: string;
  @Prop({ required: true, unique: false })
  username: string;
  @Prop({ required: false })
  password: string;
  @Prop({ required: true, default: 1 })
  role_id: string;
  @Prop({ required: true, enum: ['1', '0'], default: '1' })
  is_active: string;
  @Prop({ required: false })
  email: string;
  @Prop({ required: false })
  profile_img: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
UserSchema.pre('save', async function (next) {
  const UserModel = this.constructor as Model<UserDocument>;
  let existingUser = null;
  if (this.app_id != undefined && this.app_id != null) {
    existingUser = await UserModel.findOne({
      email: this.email,
      app_id: this.app_id,
    });
  } else {
    existingUser = await UserModel.findOne({
      username: this.username,
    });
  }
  if (existingUser) {
    const error = new Error('user already exists');
    next(error);
  } else {
    next();
  }
});
