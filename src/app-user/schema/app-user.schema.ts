import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from 'mongoose';

@Schema({
    timestamps: true,
  })
export class AppUser{
    @Prop({
      type:Types.ObjectId, ref:'Apps'
    })
    app_id:Types.ObjectId;
    @Prop({ required: true, unique: false })
    username:String;
    @Prop({ required: true})
    email:String;
    @Prop({ required: true})
    profile_img:String;
    @Prop({ required:true, default:1})
    role_id:String;
    @Prop({ required: true, enum: ['1', '0'], default: '1' })
    is_active:String;
}

export type AppUserDocument = AppUser & Document;
export const AppUserSchema = SchemaFactory.createForClass(AppUser)

