
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
    timestamps:true,
})
export class TemplateUsersReport {
  
    @Prop({ type:Types.ObjectId, ref:'User'})
    user_id:Types.ObjectId;
    @Prop({ type:Types.ObjectId, ref:"Template"})
    template_id:Types.ObjectId;
}

export const TemplateUserReportSchema = SchemaFactory.createForClass(TemplateUsersReport);