import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, InternalServerErrorException } from '@nestjs/common';
import { UserTemplatesService } from './user-templates.service';
import { CreateUserTemplateDto } from './dto/create-user-template.dto';
import { UpdateUserTemplateDto } from './dto/update-user-template.dto';
import { Response } from 'express';
import { Public } from 'src/common/public.middleware';

@Controller('user-templates')
export class UserTemplatesController {
  constructor(private readonly userTemplatesService: UserTemplatesService) {}

  @Post()
  async create(@Body() createUserTemplateDto: CreateUserTemplateDto, @Res() response:Response) {
    try{
      const result= await this.userTemplatesService.create(createUserTemplateDto);
      response.status(result.StatusCode).json(result)
    }catch(error){
      throw new InternalServerErrorException(error);
    }
    
  }

  @Public()
  @Get()
  async findAll(@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number, @Res() res:Response) {
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.userTemplatesService.findAll(currentPage,pageSize);
      res.status(data.StatusCode).json(data);
    }catch(error){
      throw new InternalServerErrorException(error);
    }
    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTemplatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserTemplateDto: UpdateUserTemplateDto) {
    return this.userTemplatesService.update(+id, updateUserTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTemplatesService.remove(+id);
  }
}
