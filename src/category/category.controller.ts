import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, InternalServerErrorException, HttpException, Res, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {  Response } from 'express';
import { Public } from 'src/common/public.middleware';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto,@Res() response: Response) {
    try{
      const result = await this.categoryService.create(createCategoryDto);
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

  @Get('/activelist')
  async findActiveCategories(@Res() response:Response){
    try{
      const data = await this.categoryService.getActiveCategories();
      response.status(data.StatusCode).json(data);
    }catch(error){
      throw InternalServerErrorException;
    }
  }

  @Public()
  @Get('/mobilecategories')
  async findCategorywithImage(@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number, @Res() response:Response){
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.categoryService.findMobileCategories(currentPage,pageSize);
      response.status(data.StatusCode).json(data);
    }catch(error){
      throw new InternalServerErrorException(error);;
    }
    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try{
      return this.categoryService.findOne(id);
    }catch(error){
      throw InternalServerErrorException;
    } 
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() response:Response) {
    try{
     const result = await this.categoryService.update(id, updateCategoryDto);
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
