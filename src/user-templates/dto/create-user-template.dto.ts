import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateUserTemplateDto {
    
    @IsNotEmpty({ message: 'App Id is required' })
    user_temp_app_id:string;
    @ApiProperty({ type: Types.ObjectId })
    @IsNotEmpty({ message: 'User Id is required' })
    user_temp_user_id:Types.ObjectId;
    @ApiProperty({ type: Types.ObjectId })
   // @IsNotEmpty({ message: 'Template Id is required' })
    user_temp_template_id:Types.ObjectId;
    // @IsNotEmpty({ message: 'Original Template Id is required' })
    user_temp_original_template_id:Types.ObjectId;
    // @IsNotEmpty({ message: 'Before Imag Id is required' })
    user_temp_before_image_url:string;
    // @IsNotEmpty({ message: 'After image Id is required' })
    user_temp_after_image_url:string;
    base_image_path:string;
    purchase_url:string;
    //@IsNumber({}, { message: 'Aspect ratio X must be a number' })
    aspect_ratio_x:number;
    //@IsNumber({}, { message: 'Aspect ratio Y must be a number' })
    aspect_ratio_y:number;
    
}
