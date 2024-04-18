import { Controller, Get, Query, InternalServerErrorException,Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/common/public.middleware';
import {  Response } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll(@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number) {
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const result = await this.usersService.findAll(currentPage,pageSize);
      return result;
    }catch(error){
      throw new InternalServerErrorException(error);
    }
    
  } 
  @Public()
  @Get('/adminusers')
  async findAllAdminUsers(@Query('currentPage') currentPage: number,@Query('app_id') app_id: string, @Query('pageSize') pageSize: number,@Res() response:Response) {
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.usersService.getAllAdminUsers(app_id,currentPage,pageSize);
      response.status(data.StatusCode).json(data);
      
    }catch(error){
      throw new InternalServerErrorException(error);
    }
    
  }
}
