import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, InternalServerErrorException, HttpException, Res, Query, SetMetadata, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {  Response } from 'express';
import { Public } from 'src/common/public.middleware';
import { ApiTags, ApiExcludeEndpoint, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
@ApiTags("category")
@Controller('category')

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  @Post()
  @ApiExcludeEndpoint()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image_url', maxCount: 1 },
  ]))
  async create(@Body() createCategoryDto: CreateCategoryDto,@Res() response: Response, @UploadedFiles() files?: { image_url?: Express.Multer.File[] }) {
    try{
      const result = await this.categoryService.create(createCategoryDto,files);
        return response.status(result.StatusCode).json({
          success:result.success,
          StatusCode:result.StatusCode,
          message:result.message,
        })
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
  

  @Get()
  @ApiExcludeEndpoint()
  async findAll(@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number, @Res() response:Response) {
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const result =  await this.categoryService.findAll(currentPage,pageSize);
      return response.status(result.StatusCode).json({result});
    }catch(error){
      throw InternalServerErrorException;
    } 
  }
  @Public()
  @Get('/categories')
  @ApiOperation({ summary: 'Get Category List' })
  @ApiQuery({ name: 'app_id', type: String })
  async getAllcategories(@Query('app_id') app_id: string, @Res() response:Response) {
    try{
   
      const result =  await this.categoryService.getAllcategories(app_id);
      return response.status(result.StatusCode).json({result});
    }catch(error){
      throw InternalServerErrorException;
    } 
  }
  @Get('/activelist')
  @ApiExcludeEndpoint()
  async findActiveCategories(@Res() response:Response){
    try{
      const data = await this.categoryService.getActiveCategories();
      response.status(data.StatusCode).json(data);
    }catch(error){
      throw InternalServerErrorException;
    }
  }
  @Get('/activelist/:id')
  @ApiExcludeEndpoint()
  async findActiveappCategories(@Param('id') id: string,@Res() response:Response){
    try{
      const data = await this.categoryService.getActiveAppCategories(id);
      response.status(data.StatusCode).json(data);
    }catch(error){
      throw InternalServerErrorException;
    }
  }

  @Public()
  @Get('/mobilecategories')
  @ApiOperation({ summary: 'Get All Category Templates' })
  @ApiQuery({ name: 'app_id', type: String })
  @ApiQuery({ name: 'currentPage', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  async findCategorywithImage(@Query('app_id') app_id: string,@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number, @Res() response:Response){
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.categoryService.findMobileCategories(app_id,currentPage,pageSize);
      response.status(data.StatusCode).json(data);
    }catch(error){
      throw new InternalServerErrorException(error);;
    }
    
  }
  @Public()
  @Get('/category')
  @ApiOperation({ summary: 'Get Category Templates' })
  @ApiQuery({ name: 'app_id', type: String })
  @ApiQuery({ name: 'cat_id', type: String ,required: false})
  @ApiQuery({ name: 'currentPage', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  async findCategory(@Query('app_id') app_id: string,@Query('cat_id') cat_id: string='',@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number, @Res() response:Response){
   
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.categoryService.findCategory(app_id,cat_id,currentPage,pageSize);
      response.status(data.StatusCode).json(data);
    }catch(error){
      throw new InternalServerErrorException(error);;
    }
    
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  findOne(@Param('id') id: string) {
    try{
      return this.categoryService.findOne(id);
    }catch(error){
      throw InternalServerErrorException;
    } 
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image_url', maxCount: 1 },
  ]))
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() response:Response, @UploadedFiles() files?: { image_url?: Express.Multer.File[] }) {
    try{
     const result = await this.categoryService.update(id, updateCategoryDto,files);
     if(result.success){
      return response.status(result.StatusCode).send(result);
     }else{
      return response.status(result.StatusCode).send(result);
     }
    }catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  async remove(@Param('id') id: string, @Res() response:Response) {
    try{
      const result = await this.categoryService.remove(id);
      return response.status(result.StatusCode).json({
        success:result.success,
        StatusCode:result.StatusCode,
        message:result.message,
      })
    }catch(error){
      throw new InternalServerErrorException(error);
    }
  }
}
