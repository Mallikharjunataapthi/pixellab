import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class UpdateUserDto {
    @IsString()
    @IsOptional()
    readonly app_id:String;
    @IsNotEmpty({ message: 'User Name is required' })
    @IsString()
    readonly username:String;
    //@IsNotEmpty({ message: 'Password is required' })
    readonly password:String;
    readonly role_id:String;
    readonly is_active:String;
    readonly email:String;
}