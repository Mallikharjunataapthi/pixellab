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
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Response } from 'express';
import {
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/public.middleware';
//@ApiExcludeController()
@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiExcludeEndpoint()
  async create(@Body() createTagDto: CreateTagDto, @Res() response: Response) {
    try {
      const result = await this.tagsService.create(createTagDto);
      return response.status(result.StatusCode).json({
        success: result.success,
        StatusCode: result.StatusCode,
        message: result.message,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Get('/activelist/:id')
  @ApiExcludeEndpoint()
  async findActiveapplist(@Param('id') id: string, @Res() response: Response) {
    try {
      const data = await this.tagsService.findAllActiveAppList(id);
      response.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Get('/activelist')
  @ApiExcludeEndpoint()
  async findActivelist(@Res() response: Response) {
    try {
      const data = await this.tagsService.findAllActiveList();
      response.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Public()
  @Get('/tags')
  @ApiOperation({ summary: 'Get Tags List' })
  @ApiQuery({ name: 'app_id', type: String })
  getalltags(@Query('app_id') app_id: string) {
    try {
      const data = this.tagsService.getalltags(app_id);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Get()
  @ApiExcludeEndpoint()
  findAll(
    @Query('searchApp') searchApp: string,
    @Query('currentPage') currentPage: number,
    @Query('pageSize') pageSize: number,
  ) {
    try {
      if (isNaN(currentPage) || isNaN(pageSize)) {
        currentPage = 1;
        pageSize = 10;
      }
      const data = this.tagsService.findAll(currentPage, pageSize, searchApp);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  findOne(@Param('id') id: string) {
    try {
      return this.tagsService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto, @Res() response:Response) {
  //   try{
  //     const result = await  this.tagsService.update(id, updateTagDto);
  //     if(result.success){
  //       return response.status(result.StatusCode).send(result);
  //      }else{
  //       return response.status(result.StatusCode).send(result);
  //      }
  //   }catch(error){
  //    throw new InternalServerErrorException(error);
  //   }

  // }
}
