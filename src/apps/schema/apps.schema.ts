
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class Apps {
  @Prop({ type:String, required:true ,unique:true})
  app_name:string
  @Prop({ type:String,default: '1'})
  is_exist:string;
}

export const AppsSchema = SchemaFactory.createForClass(Apps);