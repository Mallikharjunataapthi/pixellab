import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class UserContact {
  @Prop({
    required: [true, 'Name required'],
  })
  username: string;
  @Prop({
    required: [true, 'Email required'],
  })
  email: string;
  @Prop({
    required: [true, 'Message required'],
  })
  message: string;
  @Prop({
    required: [true, 'Message required'],
  })
  webname: string;
}
export type UserContactDocument = UserContact & Document;
export const UserContactSchema = SchemaFactory.createForClass(UserContact);
