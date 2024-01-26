import { PartialType } from '@nestjs/swagger';
import { CreateAppUserDto } from './create-app-user.dto';

export class UpdateAppUserDto extends PartialType(CreateAppUserDto) {}
