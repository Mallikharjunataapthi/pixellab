import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Apps {
  @Prop({ unique: true, required: true })
  app_name: string;
  @Prop({ type: String, default: '1' })
  is_exist: string;
  @Prop({ type: String, default: '0' })
  is_auto: string;
}

export const AppsSchema = SchemaFactory.createForClass(Apps);
