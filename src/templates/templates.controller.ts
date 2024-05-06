import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpException, HttpStatus, InternalServerErrorException, UseInterceptors, UploadedFiles, Query, SetMetadata } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import {  Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateTagDto } from 'src/tags/dto/update-tag.dto';
import { ApiTags, ApiOperation ,ApiExcludeEndpoint, ApiQuery } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Public } from 'src/common/public.middleware';

@ApiTags("templates")
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @ApiExcludeEndpoint()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'before_image_url', maxCount: 1 },
    { name: 'after_image_url', maxCount: 1 },
  ]))
  async create(@Body() createTemplateDto: CreateTemplateDto, @Res() response:Response, @UploadedFiles() files: { before_image_url: Express.Multer.File[], after_image_url: Express.Multer.File[] }) {
    try{
      const result = await this.templatesService.create(createTemplateDto,files);
      if(result){
        response.status(result.StatusCode).json(result);
      }else{
        throw Error('Something went wrong');
      }
    }catch(err:any){

      if(err instanceof HttpException){
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: err.message,
        }, HttpStatus.FORBIDDEN, {
          cause: err
        });
      }
      if(err.name == 'MongooseError'){
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: err.message,
        }, HttpStatus.FORBIDDEN, {
          cause: err
        });
      }
      if(err.message){
        return response.status(HttpStatus.BAD_REQUEST).send({
          success:false,
          StatusCode:HttpStatus.BAD_REQUEST,
          message:err.message,
        })
      }
        throw InternalServerErrorException
    }
  }   
  
  @Public()
  @Get('/toplist')
  @ApiOperation({ summary: 'Get All Top List Templates' })
  @ApiQuery({ name: 'app_id', type: String })
  @ApiQuery({ name: 'user_id', type: String, required: false,  description: 'User Liked the template (Feed) or not' })
  @ApiQuery({ name: 'tag', type: String, required: false })
  @ApiQuery({ name: 'currentPage', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  async getTopList(@Query('app_id') app_id: string,@Query('user_id') user_id ='0',@Query('tag') tag: string='',@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number,@Res() response:Response){
    try {
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.templatesService.findToptemplates(app_id,tag,currentPage,pageSize,user_id);
      response.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @Get('/trendinglist')
  @ApiOperation({ summary: 'Get All Trending List Templates' })
  @ApiQuery({ name: 'app_id', type: String })
  @ApiQuery({ name: 'user_id', type: String, required: false, description: 'User Liked the template (Feed) or not.' })
  @ApiQuery({ name: 'tag', type: String, required: false })
  @ApiQuery({ name: 'currentPage', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  async getTrendingList(@Query('app_id') app_id: string,@Query('user_id') user_id ='0',@Query('tag') tag: string='',@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number,@Res() response:Response){
    try {
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.templatesService.findTrendingtemplates(app_id,tag,currentPage,pageSize,user_id);
      response.status(data.StatusCode).json(data);
    } catch (error) {
     throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @Get('/recentlist')
  @ApiOperation({ summary: 'Get All Recent List Templates' })
  @ApiQuery({ name: 'app_id', type: String })
  @ApiQuery({ name: 'user_id', type: String, required: false, description: 'User Liked the template (Feed) or not' })
  @ApiQuery({ name: 'tag', type: String, required: false })
  @ApiQuery({ name: 'currentPage', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  async getRecentList(@Query('app_id') app_id: string,@Query('user_id') user_id ='0',@Query('tag') tag: string='' ,@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number,@Res() response:Response ){
    try {
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.templatesService.findRecenttemplates(app_id,tag,currentPage,pageSize,user_id);
      response.status(data.StatusCode).json(data);
    } catch (error) {
     throw new InternalServerErrorException(error);
    }
  }

  @Public()
  @Get('/properties/:id')
  @ApiExcludeEndpoint()
 async getTemplateforApi(@Param('id') id:Types.ObjectId, @Res() response:Response){
    try{
      const data = await this.templatesService.findTmeplate(id);
      return response.status(data.StatusCode).json(data);
    }catch(error){
      return error
    }
  }
  @Patch('/approvetemplate')
  @ApiExcludeEndpoint()
  async approveTemplates(@Body() template:any,@Res() response:Response){
    try {
     
      const template_ids= new Types.ObjectId(template.template_id);
      const checkTemplate = await this.templatesService.findOne(template_ids);
      if(!checkTemplate.success){
        return response.status(checkTemplate.StatusCode).json(checkTemplate);
      }
      const data = await this.templatesService.approveUserTemplate(template_ids);
      return response.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Patch('/declinetemplate')
  @ApiExcludeEndpoint()
  async declineTemplates(@Body() template:any,@Res() response:Response){
    try { 
      const template_ids= new Types.ObjectId(template.template_id);
      const checkTemplate = await this.templatesService.findOne(template_ids);
      if(!checkTemplate.success){
        return response.status(checkTemplate.StatusCode).json(checkTemplate);
      }
      const data = await this.templatesService.declineUserTemplate(template_ids);
      return response.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'before_image_url', maxCount: 1 },
    { name: 'after_image_url', maxCount: 1 },
  ]))
  async update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto,@Res() response:Response, @UploadedFiles() files: { before_image_url: Express.Multer.File[], after_image_url: Express.Multer.File[] }) {
    try{
    const result = await this.templatesService.update(id, updateTemplateDto,files);
    if(result){
      response.status(result.StatusCode).json(result);
    }else{
      throw Error('Something went wrong');
    }
  }catch(err:any){
    if(err instanceof HttpException){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
    if(err.name == 'MongooseError'){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
    if(err.message){
      return response.status(HttpStatus.BAD_REQUEST).send({
        success:false,
        StatusCode:HttpStatus.BAD_REQUEST,
        message:err.message,
      })
    }
      throw InternalServerErrorException
  }
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  async remove(@Param('id') id: string, @Res() response:Response) {
    try{
      const result =  await this.templatesService.remove(id);
      return response.status(result.StatusCode).json({
        success:result.success,
        StatusCode:result.StatusCode,
        message:result.message,
      });
    }catch(error){
      throw new InternalServerErrorException(error);
    }
  }
  
  @Patch('update-tag/:id')
  @ApiExcludeEndpoint()
  async updatetag(@Param('id') id: string,@Body() UpdateTagDto:UpdateTagDto, @Res() response:Response){
    try{
      const result = await this.templatesService.updatetagname(id,UpdateTagDto);
      if(result){
        response.status(result.StatusCode).json(result);
      }else{
        throw Error('Something went wrong');
      }
    }catch(error){
      throw Error(`Something went wrong: ${error}`);
    }
  }

  @Delete('delete-tag/:id')
  @ApiExcludeEndpoint()
  async DeleteTag(@Param('id') id:string ,@Res() response:Response){
    try{
      const result = await this.templatesService.DeleteTagFromTemplate(id);
      return response.status(result.StatusCode).json(result);
    }catch(error){
      throw new InternalServerErrorException(error);
    }
    
  }

  @Get()
  @ApiExcludeEndpoint()
  findAll(@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number) {
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      return this.templatesService.findAll(currentPage,pageSize);
    }catch(error){
      throw new InternalServerErrorException(error);
    }
  } 
  @Get(':id')
  @ApiExcludeEndpoint()
  findOne(@Param('id') id: Types.ObjectId) {
    try{
      return this.templatesService.findOne(id);
    }
    catch(error){
      throw InternalServerErrorException;
    } 
  }


}
