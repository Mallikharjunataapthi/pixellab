import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './Schema/template.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { FileUploadMiddleware } from 'src/common/fileupload.middleware';
import { Category } from 'src/category/schema/category.schema';
import { TagsService } from 'src/tags/tags.service';
import { UpdateTagDto } from 'src/tags/dto/update-tag.dto';
@Injectable()
export class TemplatesService {
  constructor(
     @InjectModel(Category.name) private CategoryModel: Model<Category>,
    @InjectModel(Template.name) private TemplateModel: Model<Template>,
    private tagsservice : TagsService,
    private fileuploader:FileUploadMiddleware,
  ){}
  async create(createTemplateDto: CreateTemplateDto, files: { before_image_url?: Express.Multer.File[], after_image_url?: Express.Multer.File[] }) {

    const beforeImageFile = files.before_image_url ? files.before_image_url[0] : null;
    const afterImageFile = files.after_image_url ? files.after_image_url[0] : null;

    let beforeImageS3Response  = await this.fileuploader.s3_upload(beforeImageFile);
    const afterImageS3Response = await this.fileuploader.s3_upload(afterImageFile);
  
    try{

      createTemplateDto.cat_id = new Types.ObjectId(createTemplateDto.cat_id);
      createTemplateDto.app_id = new Types.ObjectId(createTemplateDto.app_id);
      
      const categoryName = await this.CategoryModel.findById(createTemplateDto.cat_id);

      const newTemplateDto = {...createTemplateDto,before_image_url:beforeImageS3Response ?beforeImageS3Response : null, after_image_url: afterImageS3Response ? afterImageS3Response : null,category_name:categoryName.cat_name};
      
      await  this.TemplateModel.create(newTemplateDto);
      return {
        success:true,
        StatusCode:HttpStatus.CREATED,
        message:'Template Created Successfully'
      }
    }catch(err:any){
      if (err.code === 11000) {
        return {
          success: false,
          StatusCode:HttpStatus.BAD_REQUEST,
          message: 'Template already exists',
        };
      }
      if (err.code === "Template already exists") {
        return {
          success: false,
          StatusCode:HttpStatus.BAD_REQUEST,
          message: 'Template already exists',
        };
      }
      
        throw  new Error(err);
    }
  }

  async createUserTemplate(createTemplateDto:any){
    try {
      await this.TemplateModel.create(createTemplateDto);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findAll(page:number=0,pageSize:number=10) {
    try{
      const skip = (page - 1) * pageSize;
      const result = await this.TemplateModel.find().sort({ updatedAt: -1 }).skip(skip).limit(pageSize).populate('app_id', 'app_name');
      const totalTemplates = await this.TemplateModel.countDocuments();
      if(result){
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          data:{result,
            currentPage: page,
            totalPages: Math.ceil(totalTemplates / pageSize),
            pageSize}
        }
      }else{
        return {
          success:true,
          StatusCode:HttpStatus.NOT_FOUND,
          data:{result,
            currentPage: page,
            totalPages: Math.ceil(totalTemplates / pageSize),
            pageSize}
        }
      }
    }catch(error){
      return {
        success:true,
        StatusCode:HttpStatus.NOT_FOUND,
        message:'Failed to retrieve Template '
      }
    }
  }

  async findOne(id: Types.ObjectId) {
    try{
      const result = await this.TemplateModel.findById(id);
      if(result){
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          data:result
        }
      }else{
        return {
          success:false,
          StatusCode:HttpStatus.NOT_FOUND,
          data:result,
          message:'Template Not Found'
        }
      }
    }catch(error){
      return {
        success:false,
        message:error
      };
    }
  }

  async update(id:string, updateTemplateDto: UpdateTemplateDto,files: { before_image_url?: Express.Multer.File[], after_image_url?: Express.Multer.File[] }) {
    
    // this flag used to validate schema for update operations
    const opts = { runValidators: true };

    const beforeImageFile = files ? files.before_image_url ? files.before_image_url[0] : null:null;
    const afterImageFile = files ? files.after_image_url ? files.after_image_url[0] : null : null;
    let beforeImageS3URL:any;
    let afterImageS3URL:any;
    if(beforeImageFile){
      const oldFilepath = await this.TemplateModel.findById(id).select('-_id before_image_url');
      if(oldFilepath){
        await this.fileuploader.delteS3File(oldFilepath.before_image_url)
      }
      beforeImageS3URL  = await this.fileuploader.s3_upload(beforeImageFile);
    }
    if(afterImageFile){
      const oldFilepath = await this.TemplateModel.findById(id).select('-_id after_image_url');
      if(oldFilepath){
        await this.fileuploader.delteS3File(oldFilepath.after_image_url)
      }
      afterImageS3URL = await this.fileuploader.s3_upload(afterImageFile);
    }
    try{
       updateTemplateDto.cat_id = new Types.ObjectId(updateTemplateDto.cat_id);
       const categoryName = await this.CategoryModel.findById(updateTemplateDto.cat_id);
       const updateObject: any = {
        app_id:updateTemplateDto.app_id,
        cat_id: new Types.ObjectId(updateTemplateDto.cat_id),
        template_name: updateTemplateDto.template_name,
        is_active: updateTemplateDto.is_active,
        is_free: updateTemplateDto.is_free,
        category_name : categoryName.cat_name,
        tags:updateTemplateDto.tags,
        feedType:updateTemplateDto.feedType,
        template_desc:updateTemplateDto.template_desc,
      }; 
      updateObject.category_name = categoryName.cat_name;
      if(beforeImageS3URL){
        updateObject.before_image_url = beforeImageS3URL;
      }
      if(afterImageS3URL){
        updateObject.after_image_url = afterImageS3URL;
      }
      await this.TemplateModel.updateOne({_id:new Types.ObjectId(id)},updateObject,opts);
      return {
        success:true,
        StatusCode:HttpStatus.OK,
        message:'Template Updated Successfully'
      }
    }catch(err:any){
      if (err.code === 11000) {
        return {
          success: false,
          StatusCode:HttpStatus.BAD_REQUEST,
          message: 'Template  already exists',
        };
      }
      if (err.code === "Template already exists") {
        return {
          success: false,
          StatusCode:HttpStatus.BAD_REQUEST,
          message: 'Template already exists',
        };
      }
        throw  new Error(err);
    }
  }

  async updatereused_count(id:Types.ObjectId, data:number){
    try{
      await this.TemplateModel.findByIdAndUpdate(id,{used_count:data});
      return;
    }catch(error){
      throw new InternalServerErrorException(error);
    }
  }


  async remove(id:string) {
    try{
      const result = await this.TemplateModel.deleteOne({_id:id});
      if(result.deletedCount > 0){
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          message:'Template deleted successfully'
        }
      }else{
        return {
          success:false,
          StatusCode:HttpStatus.NOT_FOUND,
          message:'Template delete failed'
        }
      }

    }catch(error){
      return {
        success:false,
        message:error
      };
    }
  
  }

  async updatetagname(id:string,reqdata:UpdateTagDto){
      
    try{
      const updateddata = await this.tagsservice.update(id, reqdata);
      if(updateddata){
        await this.updatetaginTemplate(reqdata);
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          message:'Tag Updated Successfully'
        }
      }else{
        return {
          StatusCode:HttpStatus.NOT_FOUND,
          success:false,
          message:'Tag id not found'
        }
      }
    }catch(error){
      return {
        StatusCode:HttpStatus.BAD_REQUEST,
        success:false,
        message:error
      };
    }

  }
  async updatetaginTemplate(reqdata: UpdateTagDto) {
    try{
      const data = await this.TemplateModel.updateMany(
        { tags: reqdata.oldTagName },
        { $addToSet: { tags: reqdata.tag_name } }
      );
      await this.TemplateModel.updateMany(
        { tags:  reqdata.oldTagName },
        { $pull: { tags:  reqdata.oldTagName} }
      );
      return data;
    }catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async DeleteTagFromTemplate(id:string){
    try{
      const result = await this.tagsservice.remove(id);
      if(result){
        await this.DeletetaginTemplate(result);
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          message:'Tag deleted successfully'
        }
      }else{
        return {
          success:false,
          StatusCode:HttpStatus.NOT_FOUND,
          message:'Tag delete failed'
        }
      }

    }catch(error){
      return {
        success:false,
        message:error
      };
    }
  }

  async DeletetaginTemplate(result:any){
    try{
      return await this.TemplateModel.updateMany(
        {tags:result.tag_name},
        {$pull:{tags:result.tag_name}}
      )
    }catch(error){
      throw Error(`Something went Wrong: ${error}`)
    }
  }
  async getUserTemplates(page:number=0,pageSize:number=10){
    try{
      const skip = (page - 1) * pageSize;
      const filter = { 
        user_id: { $exists: true }
      };
      const result = await this.TemplateModel.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(pageSize);
      const totalTemplates = await this.TemplateModel.countDocuments(filter);
      if(result){
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          data:{result,
            currentPage: page,
            totalPages: Math.ceil(totalTemplates / pageSize),
            pageSize}
        }
      }else{
        return {
          success:true,
          StatusCode:HttpStatus.NOT_FOUND,
          data:{result,
            currentPage: page,
            totalPages: Math.ceil(totalTemplates / pageSize),
            pageSize}
        }
      }
    }catch(error){
      return {
        success:true,
        StatusCode:HttpStatus.NOT_FOUND,
        message:'Failed to retrieve Template '
      }
    }
  }

  async findToptemplates(app_id:string,page:number=0,pageSize:number=10){
    try {
      const skip = (page - 1) * pageSize;
      // start of the current month
      const startOfMonth = new Date(); 
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

       // end of the current month
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);
      const totalTemplates = await this.TemplateModel.countDocuments({app_id:app_id});
      const result = await this.TemplateModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
            is_approved: 'Approved',
            is_active:'1',
            app_id:app_id,
          },
        },
        {
          $sort: { used_count: -1 },
        },
        {
          $skip:skip
        },
        {
          $limit: pageSize,
        },
        {
          $project: {
            template_desc:0
          }
        }
      ]);

      return{
        success:true,
          StatusCode:HttpStatus.OK,
          data:{
            result,
            currentPage: page,
            totalPages: Math.ceil(totalTemplates / pageSize),
            pageSize}
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findTrendingtemplates(app_id:string,page:number=0, pageSize:number=10){
    try {
      const skip = (page - 1) * pageSize;
      const result = await this.TemplateModel.find({is_approved:'Approved',is_active:"1",app_id:app_id})
      .sort({ used_count: -1 }).skip(skip)
      .limit(pageSize).select({ template_desc: 0 });
      const totalTemplates = await this.TemplateModel.countDocuments({app_id:app_id});
      return {
        success:true,
        StatusCode:HttpStatus.OK,
        data:{result,
          currentPage: page,
          totalPages: Math.ceil(totalTemplates / pageSize),
          pageSize}
      }
    } catch (error) {
     throw new InternalServerErrorException(error);
    }
  }
  async findRecenttemplates(app_id:string,page:number=0, pageSize:number=10){
    try {
      const skip = (page - 1) * pageSize;
      const result = await this.TemplateModel.find({is_approved:'Approved', is_active:"1",app_id:app_id})
      .sort({ createdAt: -1 }).skip(skip)
      .limit(pageSize).select({ template_desc: 0 });
      const totalTemplates = await this.TemplateModel.countDocuments({app_id:app_id});
      return {
        success:true,
        StatusCode:HttpStatus.OK,
        data:{result,
          currentPage: page,
          totalPages: Math.ceil(totalTemplates / pageSize),
          pageSize}
      }
    } catch (error) {
     throw new InternalServerErrorException(error);
    }
  }

  async approveUserTemplate(template_id:Types.ObjectId){
    try {
      await this.TemplateModel.findByIdAndUpdate(template_id,{is_approved:'Approved'});
      return{
        success:true,
        StatusCode:HttpStatus.OK,
        message:'Template Approved Succesfully'
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    
  }
  async declineUserTemplate(template_id:Types.ObjectId){
    try {
      await this.TemplateModel.findByIdAndUpdate(template_id,{is_approved:'Declined'});
      return{
        success:true,
        StatusCode:HttpStatus.OK,
        message:'Template Declined Succesfully'
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    
  }

  async findTmeplate(id:Types.ObjectId){
    const data =  await this.TemplateModel.findOne({_id:id}).select({ template_desc: 1,template_name:1 });
    return {
      success:true,
      StatusCode:HttpStatus.OK,
      list:{
        data
      }
    }
  }
}
