import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  Res,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MongooseError } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from 'src/common/public.middleware';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Public()
  @Post('signup')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile_img', maxCount: 1 }]),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    try {
      const result = await this.AuthService.create(createUserDto);
      return response.status(result.StatusCode).json({
        success: result.success,
        StatusCode: result.StatusCode,
        message: result.message,
      });
    } catch (err) {
      throw MongooseError;
    }
  }

  @Public()
  @Get('signin')
  async loginUser(
    @Query() loginUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.AuthService.login(
        loginUserDto.username,
        loginUserDto.password,
      );
      response.status(data.StatusCode).json(data);
    } catch (err) {
      throw InternalServerErrorException;
    }
  }
  @Public()
  @Get('websignin')
  async loginWebUser(
    @Query() loginUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.AuthService.login(
        loginUserDto.username,
        loginUserDto.password,
        '60s',
      );
      response.status(data.StatusCode).json(data);
    } catch (err) {
      throw InternalServerErrorException;
    }
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile_img', maxCount: 1 }]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateUserDto,
    @Res() response: Response,
    @UploadedFiles() files?: { profile_img?: Express.Multer.File[] },
  ) {
    try {
      const result = await this.AuthService.update(
        id,
        updateCategoryDto,
        files,
      );
      if (result.success) {
        return response.status(result.StatusCode).send(result);
      } else {
        return response.status(result.StatusCode).send(result);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
