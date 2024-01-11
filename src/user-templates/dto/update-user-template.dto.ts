import { PartialType } from '@nestjs/swagger';
import { CreateUserTemplateDto } from './create-user-template.dto';

export class UpdateUserTemplateDto extends PartialType(CreateUserTemplateDto) {}
