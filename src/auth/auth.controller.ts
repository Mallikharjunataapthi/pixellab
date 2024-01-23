import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Post, Query, Res, UseGuards } from '@nestjs/common';
import { MongooseError } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from 'src/common/public.middleware';
@Controller('auth')
export class AuthController { 
    constructor( private readonly AuthService:AuthService){}

    @Public()
    @Post('signup')
    async create(@Body() createUserDto: CreateUserDto,@Res() response: Response) {
      try{ 
        const result = await this.AuthService.create(createUserDto);
        return response.status(result.StatusCode).json({
          success:result.success,
          StatusCode:result.StatusCode,
          message:result.message,
        })
      }catch(err){
        throw MongooseError
      }
    }
  
    @Public()
    @Get('signin')
    async loginUser(@Query() loginUserDto: CreateUserDto, @Res() response : Response) {
      try{
        const data = await this.AuthService.login(loginUserDto.username,loginUserDto.password);
        response.status(data.StatusCode).json(data);
      }catch(err){
        throw InternalServerErrorException;
      }
    }
}
