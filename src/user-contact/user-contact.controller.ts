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
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserContactService } from './user-contact.service';
import { CreateUserContactDto } from './dto/create-user-contact.dto';
import { UpdateUserContactDto } from './dto/update-user-contact.dto';
import { Response } from 'express';
import { Public } from 'src/common/public.middleware';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('user-contact')
export class UserContactController {
  constructor(private readonly userContactService: UserContactService) {}
  //@Public()
  @Post()
  @ApiExcludeEndpoint()
  async create(
    @Body() createUserContactDto: CreateUserContactDto,
    @Res() response: Response,
  ) {
    try {
      const result = await this.userContactService.create(createUserContactDto);
      return response.status(result.StatusCode).json({
        success: result.success,
        StatusCode: result.StatusCode,
        message: result.message,
      });
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: err.message,
          },
          HttpStatus.FORBIDDEN,
          {
            cause: err,
          },
        );
      }
      if (err.name == 'MongooseError') {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: err.message,
          },
          HttpStatus.FORBIDDEN,
          {
            cause: err,
          },
        );
      }
      if (err.message) {
        return response.status(HttpStatus.BAD_REQUEST).send({
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: err.message,
        });
      }
      throw InternalServerErrorException;
    }
  }
  @Get()
  @ApiExcludeEndpoint()
  async findAll(
    @Query('searchName') searchName: string,
    @Query('currentPage') currentPage: number,
    @Query('pageSize') pageSize: number,
    @Res() response: Response,
  ) {
    try {
      if (isNaN(currentPage) || isNaN(pageSize)) {
        currentPage = 1;
        pageSize = 10;
      }
      const result = await this.userContactService.findAll(
        currentPage,
        pageSize,
        searchName,
      );
      return response.status(result.StatusCode).json({ result });
    } catch (error) {
      throw InternalServerErrorException;
    }
  }
}
