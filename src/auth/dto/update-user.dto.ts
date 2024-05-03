import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from "class-validator";
import { Types } from 'mongoose';
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty({ message: 'User name is required' })
    @IsString({ message: 'User name must be a string' })
    readonly username:String;
    //@IsNotEmpty({ message: 'Password is required' })
    readonly password:String;
    email:String;
    app_id:Types.ObjectId;
    role_id:String;
    is_active:String;
}
