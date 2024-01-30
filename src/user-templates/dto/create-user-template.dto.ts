import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateUserTemplateDto {
    
    @IsNotEmpty({ message: 'App Id is required' })
    user_temp_app_id:string;
    @ApiProperty({ type: Types.ObjectId })
    @IsNotEmpty({ message: 'Template Id is required' })
    user_temp_user_id:Types.ObjectId;
    @ApiProperty({ type: Types.ObjectId })
    @IsNotEmpty({ message: 'Template Id is required' })
    user_temp_template_id:Types.ObjectId;
    @IsNotEmpty({ message: 'Template Id is required' })
    user_temp_before_image_url:string;
    @IsNotEmpty({ message: 'Template Id is required' })
    user_temp_after_image_url:string;
}
