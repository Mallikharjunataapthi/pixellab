import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Public } from 'src/common/public.middleware';
import {
  ApiTags,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
@ApiTags('app-user')
@Controller('app-user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}
  @Public()
  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user and login' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile_img', maxCount: 1 }]),
  )
  async create(
    @Body() createAppUserDto: CreateAppUserDto,
    @Res() response: Response,
    @UploadedFiles() files?: { profile_img?: Express.Multer.File[] },
  ) {
    const result = await this.appUserService.create(createAppUserDto, files);
    return response.status(result.StatusCode).json(result);
  }
  @Public()
  @Get('/userdetails')
  @ApiOperation({ summary: 'Get User Deatils' })
  @ApiQuery({ name: 'app_id', type: String })
  @ApiQuery({ name: 'user_id', type: String, description: 'User Id' })
  async findOne(
    @Query('user_id') user_id: string,
    @Query('app_id') app_id: string,
    @Res() response: Response,
  ) {
    try {
      const data = await this.appUserService.findOne(user_id, app_id);
      response.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get()
  @ApiExcludeEndpoint()
  findAll() {
    return this.appUserService.findAll();
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateAppUserDto: UpdateAppUserDto) {
    return this.appUserService.update(+id, updateAppUserDto);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  async remove(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await this.appUserService.remove(id);
      return response.status(result.StatusCode).json({
        success: result.success,
        StatusCode: result.StatusCode,
        message: result.message,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
