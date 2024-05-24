
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class UserContact {
  @Prop({
    required:[true, 'Name required']
  })
  username:String
  @Prop({
    required:[true, 'Email required']
  })
  email:String;
  @Prop({
    required:[true, 'Message required']
  })
  message:String;
  @Prop({
    required:[true, 'Message required']
  })
  webname:String;
}
export type UserContactDocument = UserContact & Document;
export const UserContactSchema = SchemaFactory.createForClass(UserContact);