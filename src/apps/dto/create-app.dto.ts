import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAppDto {
    @IsNotEmpty({message:'App Name Required'})
    app_name:string;
    @IsNotEmpty({message:'App Auto Approval Required'})
    is_auto:string;
}
