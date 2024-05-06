import { IsNotEmpty, isNotEmpty } from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
export class CreateReportTemplateDto {
    @ApiProperty({type:String,description:'App Id'})
    @IsNotEmpty({ message: 'App Id is required' })
    app_id:Types.ObjectId;

    @ApiProperty({type:String,description:'User Id'})
    @IsNotEmpty({message:'User Id Required'})
    user_id:Types.ObjectId;

    @ApiProperty({type:String,description:'Template Id'})
    @IsNotEmpty({message:'Template Id Required'})
    template_id:Types.ObjectId;

    @ApiProperty({type:String,description:'Feedback'})
    @IsNotEmpty({message:'Feedback Required'})
    feedback:string;
}
