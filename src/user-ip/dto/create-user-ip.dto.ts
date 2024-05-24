import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateUserIpDto {
    @ApiProperty({ type: String, description: 'Ip' })
    @IsNotEmpty({message:'Ip Name Required'})
    ip:String;
    template_count:String;
}
