import { PartialType } from '@nestjs/swagger';
import { CreateUserIpDto } from './create-user-ip.dto';

export class UpdateUserIpDto extends PartialType(CreateUserIpDto) {}
