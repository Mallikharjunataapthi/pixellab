import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateAppUserDto {
    @IsNotEmpty({ message: 'App is required' })
    @IsString({ message: 'App must be a string' })
    app_id:string;
    @IsNotEmpty({ message: 'User Name is required' })
    @IsString()
    readonly username:string;
    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    readonly email:string;
    @IsString()
    readonly profile_img:string;

}
