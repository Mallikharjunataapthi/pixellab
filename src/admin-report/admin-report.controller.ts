import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { AdminReportService } from './admin-report.service';

@Controller('admin-report')
export class AdminReportController {
  constructor(private readonly adminReportService: AdminReportService) {}



  @Get('/mostusedtemplates')
  async findAll(@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number, @Res() response:Response) {
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const result =  await this.adminReportService.MostUsedTemplates(currentPage,pageSize);
      return response.status(result.StatusCode).json({result});
    }catch(error){
      throw new InternalServerErrorException();;
    } 
  }

  @Get('/mostactiveusers')
  async findactiveUsers(@Body() {fromDatestring,toDateString},@Query('currentPage') currentPage: number, @Query('pageSize') pageSize: number, @Res() response:Response){
    try{
      if(isNaN(currentPage) || isNaN(pageSize)){
        currentPage = 1;
        pageSize = 10;
      }
      const result =  await this.adminReportService.MostActiveUsers(currentPage,pageSize,fromDatestring,toDateString);
      return response.status(result.StatusCode).json({result});
    }catch(error){
      throw new InternalServerErrorException(error);
    } 
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminReportService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminReportDto: UpdateAdminReportDto) {
  //   return this.adminReportService.update(+id, updateAdminReportDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminReportService.remove(+id);
  // }
}
