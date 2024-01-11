import { Prop, Schema,SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

enum CategoryType {
  Pro = 'Pro',
  Free = 'Free',
}
enum FeedType {
  Top = 'Top',
  Trending = 'Trending',
  Recent = 'Recent'
}

@Schema({
  timestamps: true,
})

export class Template{

  @Prop({
    // required:[true, 'Category required'],
    type:Types.ObjectId, ref:'Category'
  })
  cat_id:Types.ObjectId;
  @Prop({
    unique:false
  })
  template_name:string;
  @Prop({
    type:Types.ObjectId, ref:'User'
  })
  user_id:Types.ObjectId;
  @Prop({type:String})
  category_name:string; 
  @Prop({
    type:Types.ObjectId, ref:'Template'
  })
  template_id:Types.ObjectId
  @Prop({
    required:[true, 'Original image required']
  })
  before_image_url:string;
  @Prop({
    required:[true, 'Modified image required']
  })
  after_image_url:string;
  @Prop({type:Number})
  used_count:number;
  @Prop({type:Number})
  wishlist_count:number;
  @Prop({ required: true, enum: CategoryType, default: CategoryType.Free })
  is_free: CategoryType;
  @Prop({ type:String, enum:FeedType,default:'Top'  })
  feedType:string;
  @Prop({ type: Types.Array<string>, required: true })
  tags: string[];
  @Prop({ required: true, enum: ['1', '0'], default: '1' })
  is_active:String;
  @Prop({ type:String, default:'Approved' })
  is_approved:string;
  @Prop({ type:String })
  template_desc:string;
}
export type TemplateDocument = Template & Document;

export const TemplateSchema = SchemaFactory.createForClass(Template)
