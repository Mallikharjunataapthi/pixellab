import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateUserContactDto {

    @IsNotEmpty({ message: 'App is required' })
    @IsString({ message: 'App must be a string' })
    readonly username:String;
    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    readonly email:String;
    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    readonly message:String;
    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    readonly webname:String;
}
