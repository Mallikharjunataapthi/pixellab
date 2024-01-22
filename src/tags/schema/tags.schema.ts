

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Model } from 'mongoose';

export type tagsDocument = HydratedDocument<tags>;

@Schema({
    timestamps: true,
})

export class tags {
  @Prop({ type:String, required:[true, 'Tag name is required'], unique:false})
  tag_name:string;
  @Prop({
    // required:[true, 'Category required'],
    type:Types.ObjectId, ref:'Apps'
  })
  app_id:Types.ObjectId;
  @Prop({ required: true, enum: ['1', '0'], default: '1' })
  is_active:string;
}

export const tagsSchema = SchemaFactory.createForClass(tags);
tagsSchema.pre('save', async function (next) {
  const TagModel = this.constructor as Model<tagsDocument>;

  const existingTag = await TagModel.findOne({
    app_id: this.app_id,
    tag_name: this.tag_name,
  });

  if (existingTag) {
    const error = new Error('Tag already exists',);
    next(error);
  } else {
    next();
  }
});