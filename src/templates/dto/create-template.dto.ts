import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export enum FeedType {
  Top = 'Top',
  Trending = 'Trending',
  Recent = 'Recent'
}


export class CreateTemplateDto {
    @IsNotEmpty({ message: 'App is required' })
    @IsString({ message: 'App must be a string' })
    readonly app_id:String;
    @ApiProperty({ type: Types.ObjectId })
    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
      cat_id?:Types.ObjectId;
      @ApiProperty({ type: String })
      @IsNotEmpty({ message: 'Template Name is required' })
      template_name:String;
      template_id:Types.ObjectId;
      category_name:String;
    // @IsNotEmpty({ message: 'Original image is required' })
     before_image_url:String;
    // @IsNotEmpty({ message: 'Modified image is required' })
     after_image_url:String;
      @IsNotEmpty({ message: 'Template type required' })
      is_free:String;
      @IsNotEmpty({ message: 'Tags required' })
       @ApiProperty({ type: [String] })
       @IsArray()
       @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
      tags: string[];
      feedType:FeedType;
      // @IsNotEmpty({message:'json field required'})
      // propertiesjson:String;
      @IsNotEmpty({ message: 'Template Status is required' })
      is_active:String;
}

