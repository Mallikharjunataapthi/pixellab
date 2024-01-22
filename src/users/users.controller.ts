import { Controller, Get, Query, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';

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
}
