import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'App is required' })
    @IsString({ message: 'App must be a string' })
    readonly app_id:String;
    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    readonly cat_name:String;
    @IsNotEmpty({ message: 'Status is required' })
    readonly is_active:String
}
