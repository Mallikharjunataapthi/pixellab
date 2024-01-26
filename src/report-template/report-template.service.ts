import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
import { UpdateReportTemplateDto } from './dto/update-report-template.dto';
import { ReportTemplate } from './schema/reporttemplate.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TemplatesService } from 'src/templates/templates.service';
import { UsersService } from 'src/users/users.service';
import { Apps } from 'src/apps/schema/apps.schema';

@Injectable()
export class ReportTemplateService {
  constructor(
    private userservice:UsersService,
    private templateservice:TemplatesService,
    @InjectModel(Apps.name) private AppsModel: Model<Apps>,
    @InjectModel(ReportTemplate.name) private ReportTemplateSchemaSchemaModel: Model<ReportTemplate>
  ){}
  async create(createReportTemplateDto: CreateReportTemplateDto) {
    try {
      const objectIdAsString: string = createReportTemplateDto?.app_id?.toString() || '';
      const appIdlength: number = objectIdAsString.length;
      if ( appIdlength == 24 ) {
        const appid = new Types.ObjectId(createReportTemplateDto.app_id);
        const AppName = await this.AppsModel.findById(appid);
        if (AppName != undefined && AppName != null && AppName.app_name != undefined && AppName.app_name != null) { 
          const reportTemplate = {
            ...createReportTemplateDto,
            app_id: appid,
            app_name: AppName.app_name,
          }
          await this.ReportTemplateSchemaSchemaModel.create(reportTemplate);
          return{
            success:true,
            StatusCode:HttpStatus.CREATED,
            message:'created successfully'
          }
        } else {
          return{
            success:true,
            StatusCode:HttpStatus.BAD_REQUEST,
            message:'App Id Not Found'
          }
        }
      } else{
        return{
          success:true,
          StatusCode:HttpStatus.BAD_REQUEST,
          message:'App Id Is Worng'
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    
  }

  async findAll(page:number=0,pageSize:number=10) {
    try {
      const skip = (page - 1) * pageSize;
      const data = await this.ReportTemplateSchemaSchemaModel.find({is_active:1}).sort({updatedAt:-1}).skip(skip).limit(pageSize).populate('user_id', 'username').populate('template_id','template_name');
      const totalrepports = await this.ReportTemplateSchemaSchemaModel.countDocuments({is_active:1});
      return{
        success:true,
        StatusCode:HttpStatus.CREATED,
        data:{
          data, currentPage: page,
          totalPages: Math.ceil(totalrepports / pageSize),
          pageSize}
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} reportTemplate`;
  }

  async update(id: string, updateReportTemplateDto: UpdateReportTemplateDto) {
    try {
      await this.ReportTemplateSchemaSchemaModel.updateOne({_id:id},updateReportTemplateDto);
      return{
        success:true,
        StatusCode:HttpStatus.CREATED,
        message:'updated successfully'
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async checktemplate(id:Types.ObjectId){
    try {
      const data = await this.templateservice.findOne(id);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    } 
  }
  async checkuser(id:Types.ObjectId){
    try {
      const data = await this.userservice.findOne(new Types.ObjectId(id));
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    
  }
}
