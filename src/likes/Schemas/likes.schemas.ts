

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Likes {
  @Prop({
    type:Types.ObjectId, ref:'User',
    required:true
  })
  user_id : Types.ObjectId;
  @Prop({
    type:Types.ObjectId, ref:'Template',
    required:true
  })
  template_id : Types.ObjectId;
  @Prop({
    type:Types.ObjectId, ref:'Apps',
    required:true
  })
  app_id : Types.ObjectId;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);

// LikesSchema.post('save', async (savedata,next) => {
//     // Update related templates
//     const TemplateModel = model<Template>('Template');
//     await TemplateModel.updateOne({ _id: savedata.template_id }, { $inc:{wishlist_count: +1 }});
//     next();
// });
// LikesSchema.post('save', async (removedata,next) => {
//     // Update related templates
//     const TemplateModel = model<Template>('Template');
//     await TemplateModel.updateOne({ _id: removedata.template_id }, { $inc:{wishlist_count: -1 }});
//     next();
// });