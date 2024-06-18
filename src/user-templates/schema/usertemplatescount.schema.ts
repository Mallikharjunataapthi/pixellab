import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class TemplateUsersReport {
  @Prop({
    // required:[true, 'Category required'],
    type: Types.ObjectId,
    ref: 'Apps',
  })
  app_id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Template' })
  template_id: Types.ObjectId;
  @Prop({ type: String })
  app_name: string;
}

export const TemplateUserReportSchema =
  SchemaFactory.createForClass(TemplateUsersReport);
