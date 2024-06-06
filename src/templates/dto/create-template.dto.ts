import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";

export enum FeedType {
  Top = 'Top',
  Trending = 'Trending',
  Recent = 'Recent'
}


export class CreateTemplateDto {
    @ApiProperty({ type: Types.ObjectId, description: 'App Id' })
    @IsNotEmpty({ message: 'App is required' })
    @IsString({ message: 'App must be a string' })
    app_id:Types.ObjectId;

   
    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    cat_id?:Types.ObjectId;

    @IsNotEmpty({ message: 'Template Name is required' })
    template_name:String;

    template_id:Types.ObjectId;

    @ApiPropertyOptional({ type: Types.ObjectId, description: 'Category Name' })
    category_name:String;

    // @IsNotEmpty({ message: 'Original image is required' })
     before_image_url:String;

    // @IsNotEmpty({ message: 'Modified image is required' })
    after_image_url:String;

    @IsNotEmpty({ message: 'Is Free type required' })
    is_free:String;

    @IsNotEmpty({ message: 'Tags required' })
    @ApiProperty({ type: [String] })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
    tags: string[];

    feedType:FeedType;

    template_desc:String;

    @IsNotEmpty({ message: 'Template Description is required' })
    is_active:String;

    @ApiPropertyOptional({ type: Types.ObjectId, description: 'User Id' })
    @IsNotEmpty({ message: 'User is required' })
    user_id:Types.ObjectId;

    base_image_path:string;

    purchase_url:string;
    //@IsNumber({}, { message: 'Aspect ratio X must be a number' })
    aspect_ratio_x:number;
   // @IsNumber({}, { message: 'Aspect ratio X must be a number' })
    aspect_ratio_y:number;
}

