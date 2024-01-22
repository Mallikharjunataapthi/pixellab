import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true,
  })
export class User{
    @Prop({ required: true, unique: false })
    username:String;
    @Prop({ required: true})
    password:String;
    @Prop({ required:true, default:1})
    role_id:String
}


export const UserSchema = SchemaFactory.createForClass(User)