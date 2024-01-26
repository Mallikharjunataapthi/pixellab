
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({
  timestamps: true,
})
export class Apps {
  @Prop({ unique: true, required:true})
  app_name:String
  @Prop({ type:String,default: '1'})
  is_exist:string;
}

export const AppsSchema = SchemaFactory.createForClass(Apps);