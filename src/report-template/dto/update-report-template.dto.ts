import { PartialType } from '@nestjs/swagger';
import { CreateReportTemplateDto } from './create-report-template.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateReportTemplateDto extends PartialType(
  CreateReportTemplateDto,
) {
  @IsNotEmpty({ message: 'Is active is required' })
  is_active: string;
}
