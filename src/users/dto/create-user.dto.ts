import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly username:String;
    @IsNotEmpty({ message: 'Password is required' })
    readonly password:String;
}
