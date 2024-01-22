import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateDto } from './create-template.dto';
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

enum FeedType {
      Top = 'Top',
      Trending = 'Trending',
      Recent = 'Recent'
    }
    
export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
      @IsNotEmpty({ message: 'App is required' })
      @IsString({ message: 'App must be a string' })
      readonly app_id:String;
      @IsNotEmpty({ message: 'Category is required' })
      @IsString({ message: 'Category must be a string' })
      cat_id:Types.ObjectId;
      @IsNotEmpty({ message: 'Template Name is required' })
      template_name:String;
      @IsOptional()
      before_image_url:String;
      @IsOptional()
      after_image_url:String;
      @IsNotEmpty({ message: 'Template type required' })
      @IsNotEmpty({ message: 'Tags required' })
      tags:Types.Array<string>;
      feedType:FeedType;
      is_free:String;
      @IsNotEmpty({ message: 'Template Status is required' })
      is_active:String;
}
