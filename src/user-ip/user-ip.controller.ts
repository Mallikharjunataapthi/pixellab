import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserIpService } from './user-ip.service';
import { CreateUserIpDto } from './dto/create-user-ip.dto';
import { UpdateUserIpDto } from './dto/update-user-ip.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/common/public.middleware';

@ApiTags('user-ip')
@Controller('user-ip')
export class UserIpController {
  constructor(private readonly userIpService: UserIpService) {}
  @Post()
  @ApiExcludeEndpoint()
  create(@Body() createUserIpDto: CreateUserIpDto) {
    return this.userIpService.create(createUserIpDto);
  }
  @Public()
  @Get()
  @ApiExcludeEndpoint()
  async findAll(@Query('user_ip') user_ip: string, @Res() response: Response) {
    const data = await this.userIpService.findAll(user_ip);
    response.status(data.StatusCode).json(data);
  }
}
