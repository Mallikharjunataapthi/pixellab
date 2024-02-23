import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';

@Schema({
    timestamps: true,
  })
export class User{
    @Prop({
      type:Types.ObjectId, ref:'Apps'
    })
    app_id:Types.ObjectId;
    @Prop({ required: false})
    app_name:String;
    @Prop({ required: true, unique: false })
    username:String;
    @Prop({ required: false})
    password:String;
    @Prop({ required:true, default:1})
    role_id:String;
    @Prop({ required: true, enum: ['1', '0'], default: '1' })
    is_active:String;
    @Prop({ required: false})
    email:String;
    @Prop({ required: false})
    profile_img:String;
}


export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
UserSchema.pre('save', async function (next) {
  const UserModel = this.constructor as Model<UserDocument>;
  let existingUser=null;
  if ( this.app_id != undefined && this.app_id != null){
  
  } else {
     existingUser = await UserModel.findOne({
      username: this.username,
    });
  }
    if (existingUser) {
        const error = new Error('user already exists');
        next(error);
    } else {
      next();
    }
  

});