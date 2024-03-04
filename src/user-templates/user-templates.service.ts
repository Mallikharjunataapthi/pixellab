import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserTemplateDto } from './dto/create-user-template.dto';
import { UpdateUserTemplateDto } from './dto/update-user-template.dto';
import { TemplatesService } from 'src/templates/templates.service';
import { Model, Types } from 'mongoose';
import { TemplateUsersReport, TemplateUserReportSchema } from './schema/usertemplatescount.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Apps } from 'src/apps/schema/apps.schema';
import { FileUploadMiddleware } from 'src/common/fileupload.middleware';
@Injectable()
export class UserTemplatesService {
  constructor(
    @InjectModel(TemplateUsersReport.name) private TemplateUsersReportModel: Model<TemplateUsersReport>,
    @InjectModel(Apps.name) private AppsModel: Model<Apps>,
    private templatesService : TemplatesService,
    private fileuploader:FileUploadMiddleware,
  ){}
  async create(createUserTemplateDto: CreateUserTemplateDto,files: { user_temp_before_image_url?: Express.Multer.File[], user_temp_after_image_url?: Express.Multer.File[] }) {
    try{
      const beforeImageFile = files.user_temp_before_image_url ? files.user_temp_before_image_url[0] : null;
    const afterImageFile = files.user_temp_after_image_url ? files.user_temp_after_image_url[0] : null;

    let beforeImageS3Response  = await this.fileuploader.s3_upload(beforeImageFile);
    const afterImageS3Response = await this.fileuploader.s3_upload(afterImageFile);
      if ( createUserTemplateDto?.user_temp_app_id.length == 24 ) {
        const appid = new Types.ObjectId(createUserTemplateDto.user_temp_app_id);
        const AppName = await this.AppsModel.findById(appid);
        if (AppName != undefined && AppName != null && AppName.app_name != undefined && AppName.app_name != null) {
          
          const templateData = await this.templatesService.findOne(createUserTemplateDto.user_temp_template_id);
          if(!templateData.data){
            return{
              success:false,
              StatusCode:HttpStatus.NOT_FOUND,
              data: 'Template Not Found'
            }
          }
          if (templateData && templateData.data !== undefined && templateData.data.used_count) {
            templateData.data.used_count++;
            
            await this.templatesService.updatereused_count(createUserTemplateDto.user_temp_template_id, templateData.data.used_count);
          }else{
            templateData.data.used_count = 1;
            await this.templatesService.updatereused_count(new Types.ObjectId(createUserTemplateDto.user_temp_template_id), templateData.data.used_count);
          }

          const userusedCount = {
            app_id:new Types.ObjectId(createUserTemplateDto.user_temp_app_id),
            user_id:createUserTemplateDto.user_temp_user_id,
            template_id:createUserTemplateDto.user_temp_template_id,
            app_name:AppName.app_name,
          }
          
          try{
            await this.TemplateUsersReportModel.create(userusedCount );
          }catch(error){
          throw new InternalServerErrorException(error);
          }
       
          const UsertempalteObject = {
            app_id: new Types.ObjectId(createUserTemplateDto.user_temp_app_id),
            app_name:AppName.app_name,
            user_id: new Types.ObjectId(createUserTemplateDto.user_temp_user_id),
            template_id: new Types.ObjectId(createUserTemplateDto.user_temp_template_id),
            original_template_id: new Types.ObjectId(createUserTemplateDto.user_temp_original_template_id),
            before_image_url:beforeImageS3Response ?beforeImageS3Response : null,
            after_image_url:afterImageS3Response ? afterImageS3Response : null,
            cat_id:templateData.data.cat_id,
            category_name:templateData.data.category_name,
            whishlist_count:0,
            is_free:templateData.data.is_free,
            is_active:templateData.data.is_active,
            used_count:templateData.data.used_count,
            wishlist_count:0,
            tags:templateData.data.tags,
            feedType:templateData.data.feedType,
            template_desc:templateData.data.template_desc,
            is_approved:'Pending',
          }
          await this. templatesService.createUserTemplate(UsertempalteObject);
          return{
            success:true,
            StatusCode:HttpStatus.CREATED,
            data: 'Created successfully'
          }
        } else {
          return{
            success:false,
            StatusCode:HttpStatus.BAD_REQUEST,
            data: 'App Id Not Found'
          }
        }
      } else {
        return{
          success:false,
          StatusCode:HttpStatus.BAD_REQUEST,
          data: 'App Id is worng'
        }
      }
    }catch(error){
      throw new InternalServerErrorException(error);
    }

    
  }

  findAll(app_id:string,user_id:string,currentPage:number=0,pageSize:number=10) {
    try {
      const data = this.templatesService.getUserTemplates(app_id,user_id,currentPage,pageSize);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findAllChildTemplate(app_id:string,template_id:string,currentPage:number=0,pageSize:number=10) {
    try {
      const data = this.templatesService.getChildTemplate(app_id,template_id,currentPage,pageSize);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} userTemplate`;
  }

  update(id: number, updateUserTemplateDto: UpdateUserTemplateDto) {
    return `This action updates a #${id} userTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} userTemplate`;
  }
}
