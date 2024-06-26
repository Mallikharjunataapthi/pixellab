import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

enum CategoryType {
  Pro = 'Pro',
  Free = 'Free',
}
enum FeedType {
  Top = 'Top',
  Trending = 'Trending',
  Recent = 'Recent',
}

@Schema({
  timestamps: true,
})
export class UserTemplate {
  @Prop({
    type: Types.ObjectId,
    ref: 'Apps',
  })
  app_id: Types.ObjectId;
  @Prop({
    required: [true, 'Category required'],
    type: Types.ObjectId,
    ref: 'Category',
  })
  cat_id: Types.ObjectId;
  @Prop({
    required: [true, 'Template Name required'],
    unique: true,
  })
  template_name: string;
  @Prop({ type: String })
  category_name: string;
  @Prop({
    required: [true, 'Original image required'],
  })
  before_image_url: string;
  @Prop({
    required: [true, 'Modified image required'],
  })
  after_image_url: string;
  @Prop({ type: Number })
  used_count: number;
  @Prop({ type: Number })
  wishlist_count: number;
  @Prop({ required: true, enum: CategoryType, default: CategoryType.Free })
  is_free: CategoryType;
  @Prop({ type: String, enum: FeedType, default: 'Top' })
  feedType: string;
  @Prop({ type: Types.Array<string>, required: true })
  tags: string[];
  @Prop({ required: true, enum: ['1', '0'], default: '1' })
  is_active: string;
  @Prop({ type: String })
  app_name: string;
  @Prop({ type: String })
  base_image_path: string;
  @Prop({ type: String })
  purchase_url: string;
  @Prop({ type: Number, default: '3' })
  aspect_ratio_x: number;
  @Prop({ type: Number, default: '4' })
  aspect_ratio_y: number;
  @Prop({ type: String })
  api_to_call: string;
  @Prop({ type: String, default: 'none'  })
  style_name: string;

  @Prop({ type: Number, default: '0.7'  })
  identitynet_strength_ratio: number;

  @Prop({ type: Number, default: '0.8'  })
  adapter_strength_ratio: number;

  @Prop({ type: Number })
  num_steps: number;

  @Prop({ type: Number })
  seed: number;

  @Prop({ type: String })
  prompt: string;
}

export const UserTemplateSchema = SchemaFactory.createForClass(UserTemplate);
