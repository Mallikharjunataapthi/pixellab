import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateLikeDto {
    @IsNotEmpty()
    user_id:Types.ObjectId;
    @IsNotEmpty()
    template_id:Types.ObjectId
    @IsNotEmpty()
    app_id:Types.ObjectId
}
