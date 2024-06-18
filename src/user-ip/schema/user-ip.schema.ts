import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class UserIp {
  @Prop({ unique: true, required: true })
  ip: string;
  @Prop({ required: false, default: '1' })
  template_count: number;
}
export const UserIpSchema = SchemaFactory.createForClass(UserIp);
