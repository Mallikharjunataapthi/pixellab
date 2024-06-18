import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAppDto {
  @ApiProperty({ type: String, description: 'App Name' })
  @IsNotEmpty({ message: 'App Name Required' })
  app_name: string;
  @ApiProperty({
    type: String,
    description: 'For App Auto Approval Pass Value 1 else 0',
  })
  @IsNotEmpty({ message: 'App Auto Approval Required' })
  is_auto: string;
}
