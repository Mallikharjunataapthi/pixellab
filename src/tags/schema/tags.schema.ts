

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type tagsDocument = HydratedDocument<tags>;

@Schema({
    timestamps: true,
})
export class tags {
  @Prop({ type:String, required:true, unique:true})
  tag_name:string;
  @Prop({ required: true, enum: ['1', '0'], default: '1' })
  is_active:string;
}

export const tagsSchema = SchemaFactory.createForClass(tags);