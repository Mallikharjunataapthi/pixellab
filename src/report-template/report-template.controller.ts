import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query, InternalServerErrorException } from '@nestjs/common';
import { ReportTemplateService } from './report-template.service';
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
import { UpdateReportTemplateDto } from './dto/update-report-template.dto';
import { Response } from 'express';

@Controller('report-template')
export class ReportTemplateController {
  constructor(private readonly reportTemplateService: ReportTemplateService) {}

  @Post()
  async create(@Body() createReportTemplateDto: CreateReportTemplateDto, @Res() response:Response) {
    try {
       const checkuserexist = await this.reportTemplateService.checkuser(createReportTemplateDto.user_id);
      const checktemplateexist = await this.reportTemplateService.checktemplate(createReportTemplateDto.template_id);
      if(!checktemplateexist.success){
        return response.status(404).json({
          sucess:false,
          StatusCode:HttpStatus.NOT_FOUND,
          message:'Template Not Foud'
        })
      }
      if(!checkuserexist.success){
        return response.status(404).json({
          sucess:false,
          StatusCode:HttpStatus.NOT_FOUND,
          message:'User Not Foud'
        })
      }
      const data = await this.reportTemplateService.create(createReportTemplateDto);
      response.status(data.StatusCode).json(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    
  }

  @Get()
  async findAll( @Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number, @Res() response:Response) {
    try {
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const data = await this.reportTemplateService.findAll(currentPage,pageSize);
      response.status(data.StatusCode).json(data);
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportTemplateService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReportTemplateDto: UpdateReportTemplateDto,@Res() response:Response) {
    try {
      const data = await this.reportTemplateService.update(id, updateReportTemplateDto);
      response.status(data.StatusCode).json(data);
    }catch(error){
      throw new InternalServerErrorException(error);
    }
  }

}
