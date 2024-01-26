import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserTemplateDto } from './dto/create-user-template.dto';
import { UpdateUserTemplateDto } from './dto/update-user-template.dto';
import { TemplatesService } from 'src/templates/templates.service';
import { Model, Types } from 'mongoose';
import { TemplateUsersReport, TemplateUserReportSchema } from './schema/usertemplatescount.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Apps } from 'src/apps/schema/apps.schema';
@Injectable()
export class UserTemplatesService {
  constructor(
    @InjectModel(TemplateUsersReport.name) private TemplateUsersReportModel: Model<TemplateUsersReport>,
    @InjectModel(Apps.name) private AppsModel: Model<Apps>,
    private templatesService : TemplatesService,
  ){}
  async create(createUserTemplateDto: CreateUserTemplateDto) {
    try{
     
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
            app_id:createUserTemplateDto.user_temp_app_id,
            user_id:createUserTemplateDto.user_temp_user_id,
            template_id:createUserTemplateDto.user_temp_template_id,
            app_name:AppName.app_name,
          }
          
          try{
            await this.TemplateUsersReportModel.create(userusedCount);
          }catch(error){
          throw new InternalServerErrorException(error);
          }
          

          const hashtagRegex = /#(\w+)/g;
        // const tags =   createUserTemplateDto.user_temp_template_desc.match(hashtagRegex);
          const modifiedHashtags = [];
          let match:any;

          while ((match = hashtagRegex.exec(createUserTemplateDto.user_temp_template_desc)) !== null) {
              modifiedHashtags.push(match[1]);
          }
          const UsertempalteObject = {
            app_id: new Types.ObjectId(createUserTemplateDto.user_temp_app_id),
            app_name:AppName.app_name,
            user_id: new Types.ObjectId(createUserTemplateDto.user_temp_user_id),
            template_id: new Types.ObjectId(createUserTemplateDto.user_temp_template_id),
            before_image_url:createUserTemplateDto.user_temp_before_image_url,
            after_image_url:createUserTemplateDto.user_temp_after_image_url,
            cat_id:templateData.data.cat_id,
            category_name:templateData.data.category_name,
            whishlist_count:0,
            is_free:templateData.data.is_free,
            is_active:templateData.data.is_active,
            used_count:templateData.data.used_count,
            wishlist_count:0,
            tags:modifiedHashtags,
            feedType:templateData.data.feedType,
            template_desc:createUserTemplateDto.user_temp_template_desc,
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

  findAll(currentPage:number=0,pageSize:number=10) {
    try {
      const data = this.templatesService.getUserTemplates(currentPage,pageSize);
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
