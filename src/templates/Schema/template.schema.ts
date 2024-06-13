import { Prop, Schema,SchemaFactory } from "@nestjs/mongoose";
import { Types, Model } from "mongoose";

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
    type:Types.ObjectId, ref:'Apps'
  })
  app_id:Types.ObjectId;

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
  @Prop({ type: Types.Array<string>, required: false })
  tags: string[];
  @Prop({ required: true, enum: ['1', '0'], default: '1' })
  is_active:String;
  @Prop({ type:String, default:'Approved' })
  is_approved:string;
  @Prop({ type:String })
  template_desc:string;
  @Prop({ type:String })
  base_image_path:string;
  @Prop({
    type:Types.ObjectId, ref:'Template'
  })
  original_template_id:Types.ObjectId
  @Prop({ type:String })
  purchase_url:string;
  @Prop({ type:Number, default: '3' })
  aspect_ratio_x:number;
  @Prop({ type:Number, default: '4' })
  aspect_ratio_y:number;
  @Prop({ type:String })
  api_to_call: string;
}
export type TemplateDocument = Template & Document;

export const TemplateSchema = SchemaFactory.createForClass(Template)
TemplateSchema.pre('save', async function (next) {
  const TemplateModel = this.constructor as Model<TemplateDocument>;
  let existingTag =null;
  if(this.template_name != undefined){
    existingTag = await TemplateModel.findOne({
      app_id: this.app_id,
      template_name: this.template_name,
      cat_id : this.cat_id,
    });
  }
  if (existingTag) {
    const error = new Error('Template already exists',);
    next(error);
  } else {
    next();
  }
});
TemplateSchema.pre('updateOne', async function (next) {
  const query = this.getQuery();
  const update = this.getUpdate() as { app_id?: any; cat_id?: any; template_name?: any };

  const template_name = update?.template_name;
  const app_id = update?.app_id;
  const cat_id = update?.cat_id != undefined ? update?.cat_id.toString() :null;
  const TemplateModel = this.model as Model<TemplateDocument>;
  const existingTemplate = await TemplateModel.findOne({
      app_id: app_id,
      cat_id:cat_id,
      template_name: template_name,
      _id: { $ne: query._id },
  });

  if (existingTemplate) {
   
    const error = new Error("Template already exists");
    next(error);
  } else {
      next();
  }
});
TemplateSchema.virtual('likedBy', {
  ref: 'Likes',
  localField: '_id',
  foreignField: 'template_id',
  justOne: false,
});