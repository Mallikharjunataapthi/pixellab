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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserTemplatesService } from './user-templates.service';
import { CreateUserTemplateDto } from './dto/create-user-template.dto';
import { UpdateUserTemplateDto } from './dto/update-user-template.dto';
import { Response } from 'express';
import { Public } from 'src/common/public.middleware';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('user-templates')
@Controller('user-templates')
export class UserTemplatesController {
  constructor(private readonly userTemplatesService: UserTemplatesService) {}
  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user Template (Feed)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_temp_app_id: { type: 'string', required: ['false'] },
        user_temp_user_id: { type: 'string' },
        user_temp_template_id: { type: 'string', required: ['false'] },
        user_temp_original_template_id: { type: 'string', required: ['false'] },
        base_image_path: { type: 'string', required: ['false'] },
        purchase_url: { type: 'string', required: ['false'] },
        user_temp_before_image_url: { type: 'string', format: 'binary' },
        user_temp_after_image_url: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'user_temp_before_image_url', maxCount: 1 },
      { name: 'user_temp_after_image_url', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createUserTemplateDto: CreateUserTemplateDto,
    @Res() response: Response,
    @UploadedFiles()
    files: {
      user_temp_before_image_url: Express.Multer.File[];
      user_temp_after_image_url: Express.Multer.File[];
    },
  ) {
    try {
      const result = await this.userTemplatesService.create(
        createUserTemplateDto,
        files,
      );
      response.status(result.StatusCode).json(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get All User Created Templates' })
  @ApiQuery({ name: 'app_id', type: String })
  @ApiQuery({ name: 'user_id', type: String, description: 'User Id' })
  @ApiQuery({ name: 'pageSize', type: Number })
  @ApiQuery({ name: 'currentPage', type: Number })
  async findAll(
    @Query('currentPage') currentPage: number,
    @Query('app_id') app_id: string,
    @Query('user_id') user_id: string = '',
    @Query('pageSize') pageSize: number,
    @Res() res: Response,
  ) {
    try {
      if (isNaN(currentPage) || isNaN(pageSize)) {
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.userTemplatesService.findAll(
        app_id,
        user_id,
        currentPage,
        pageSize,
      );
      res.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @Get('/childtemplates')
  @ApiOperation({ summary: 'Get All Sub Templates' })
  @ApiQuery({ name: 'app_id', type: String })
  @ApiQuery({
    name: 'template_id',
    type: String,
    description: 'Original Template Id',
  })
  @ApiQuery({ name: 'pageSize', type: Number })
  @ApiQuery({ name: 'currentPage', type: Number })
  async findAllChildTemplate(
    @Query('currentPage') currentPage: number,
    @Query('app_id') app_id: string,
    @Query('template_id') template_id,
    @Query('pageSize') pageSize: number,
    @Res() res: Response,
  ) {
    try {
      if (isNaN(currentPage) || isNaN(pageSize)) {
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.userTemplatesService.findAllChildTemplate(
        app_id,
        template_id,
        currentPage,
        pageSize,
      );
      res.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  findOne(@Param('id') id: string) {
    return this.userTemplatesService.findOne(+id);
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  update(
    @Param('id') id: string,
    @Body() updateUserTemplateDto: UpdateUserTemplateDto,
  ) {
    return this.userTemplatesService.update(+id, updateUserTemplateDto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Template' })
  async remove(
    @Param('id') id: string,
    @Query('app_id') app_id: string,
    @Res() response: Response,
  ) {
    try {
      const result = await this.userTemplatesService.remove(id, app_id);
      response.status(result.StatusCode).json(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
