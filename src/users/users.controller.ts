import { Controller, Get, Res, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';

import {Response} from "express"
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll(@Res() response:Response) {
    try{
      const result = await this.usersService.findAll();
      response.status(result.StatusCode).json(result);
    }catch(error){
      throw new InternalServerErrorException(error);
    }
    
  } 
}
