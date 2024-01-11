import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
    timestamps:true,
})
export class ReportTemplate {
    @Prop({ type:Types.ObjectId, required:true, ref:"User"})
    user_id:Types.ObjectId;
    @Prop({ type:Types.ObjectId, required:true, ref:"Template"})
    template_id:Types.ObjectId
    @Prop({ type:String, required:true})
    feedback:string
    @Prop({ type:String, default:1})
    is_active:string
}

export const ReportTemplateSchemaSchema = SchemaFactory.createForClass(ReportTemplate);