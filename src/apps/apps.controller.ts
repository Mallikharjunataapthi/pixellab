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
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { Response } from 'express';
import mongoose, { Mongoose } from 'mongoose';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('apps')
@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  @ApiExcludeEndpoint()
  create(@Body() createAppDto: CreateAppDto) {
    return this.appsService.create(createAppDto);
  }

  @Get()
  @ApiExcludeEndpoint()
  async findAll(
    @Query('currentPage') currentPage: number,
    @Query('pageSize') pageSize: number,
    @Res() response: Response,
  ) {
    if (isNaN(currentPage) || isNaN(pageSize)) {
      currentPage = 1;
      pageSize = 10;
    }
    const data = await this.appsService.findAll(currentPage, pageSize);
    response.status(data.StatusCode).json(data);
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  findOne(@Param('id') id: mongoose.Types.ObjectId) {
    return this.appsService.findOne(id);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  async remove(@Param('id') id: mongoose.Types.ObjectId) {
    const isValid = await this.appsService.findOne(id);
    if (!isValid) {
      return {
        success: false,
        StatusCode: HttpStatus.OK,
        message: 'App Id invalid',
      };
    }
    return await this.appsService.remove(id);
  }
}
