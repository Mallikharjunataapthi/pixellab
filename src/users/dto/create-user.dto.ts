import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsOptional()
    readonly app_id:String;
    @IsNotEmpty({ message: 'User Name is required' })
    @IsString()
    readonly username:String;
    @IsNotEmpty({ message: 'Password is required' })
    readonly password:String;
}
