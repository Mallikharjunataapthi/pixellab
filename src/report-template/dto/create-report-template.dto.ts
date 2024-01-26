import { IsNotEmpty, isNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateReportTemplateDto {
    @IsNotEmpty({ message: 'App Id is required' })
    app_id:Types.ObjectId;
    @IsNotEmpty({message:'User Id Required'})
    user_id:Types.ObjectId;
    @IsNotEmpty({message:'Template Id Required'})
    template_id:Types.ObjectId;
    @IsNotEmpty({message:'Feedback Required'})
    feedback:string;
}
