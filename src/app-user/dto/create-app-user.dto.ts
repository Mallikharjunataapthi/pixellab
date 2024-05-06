import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
export class CreateAppUserDto {

    @IsNotEmpty({ message: 'App is required' })
    @IsString({ message: 'App must be a string' })
    @ApiProperty({ type: String, description: 'App ID' })
    app_id:String;

    @ApiProperty({ type: String, description: 'User Email Name' })
    @IsNotEmpty({ message: 'User Name is required' })
    @IsString()
    readonly username:string;

    @ApiProperty({ type: String, description: 'User Email Id' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    readonly email:string;
    
    @IsOptional()
    @ApiPropertyOptional({ type: String, description: 'User Email Profile URL' })
    @IsString()
    readonly profile_img?:string;

}
