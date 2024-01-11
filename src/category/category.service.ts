import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/category.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from 'src/templates/Schema/template.schema';
@Injectable()
export class CategoryService { 
  constructor(
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    @InjectModel(Template.name) private TemplateModel: Model<Template>

  ){}


  async create(createCategoryDto: CreateCategoryDto) {
    try{
      await  this.CategoryModel.create(createCategoryDto);
      return {
        success:true,
        StatusCode:HttpStatus.OK,
        message:'Category Created Successfully'
      }
    }catch(err:any){
      if (err.code === 11000) {
        return {
          success: false,
          StatusCode:HttpStatus.BAD_REQUEST,
          message: 'Category already exists',
        };
      }
        throw  new Error(err);
    }
  }

  async findAll(page:number=0,pageSize:number=10) {
    try{
      const skip = (page - 1) * pageSize;
      const result = await this.CategoryModel.find().sort({ updatedAt: -1 }).skip(skip).limit(pageSize);
      const totalCategories = await this.CategoryModel.countDocuments();
      if(result){
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          data:{result,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / pageSize),
            pageSize}
        }
      }else{
        return {
          success:true,
          StatusCode:HttpStatus.NOT_FOUND,
          data:{result,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / pageSize),
            pageSize}
        }
      }
    }catch(error){
      return {
        success:false,
        StatusCode:HttpStatus.BAD_REQUEST,
        message:'Category Fetching failed'
      }
    }
  }

  async getActiveCategories(){
    try{
      const result = await this.CategoryModel.find({is_active:'1'}).sort({updatedAt:-1});
      if(result){
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          data:{result}
        }
      }else{
        return {
          success:true,
          StatusCode:HttpStatus.NOT_FOUND,
          data:{result}
        }
      }
    }catch(error){
      return {
        success:false,
        StatusCode:HttpStatus.BAD_REQUEST,
        message:'Category Fetching failed'
      }
    }
  }
  async findOne(id: String) {
    try{
      const result = await this.CategoryModel.findById(id);
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
          data:result
        }
      }
    }catch(error){
      return {
        success:false,
        message:error
      };
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try{
          // this flag used to validate schema for update operations
      const opts = { runValidators: true };
       const result = await this.CategoryModel.findOneAndUpdate({_id:id},updateCategoryDto,opts);
        if(result){
          await this.updatecategory(id, updateCategoryDto)
          return {
            success:true,
            StatusCode:HttpStatus.OK,
            message:'Category Updated Successfully'
          }
        }else{
          return {
            StatusCode:HttpStatus.NOT_FOUND,
            success:false,
            message:'Category id not found'
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
  async updatecategory(id:string,updateCategoryDto:UpdateCategoryDto) {
    return await this.TemplateModel.updateMany({cat_id: new Types.ObjectId(id)},{category_name:updateCategoryDto.cat_name})
  }

  async remove(id: String) {
    try{
      const result = await this.CategoryModel.deleteOne({_id:id});
      if(result.deletedCount > 0){
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          message:'Category deleted successfully'
        }
      }else{
        return {
          success:false,
          StatusCode:HttpStatus.NOT_FOUND,
          message:'Category delete failed'
        }
      }

    }catch(error){
      return {
        success:false,
        message:error
      };
    }
  }
  async findMobileCategories(page:number,pageSize:number) {

    const skip = (page - 1) * pageSize;
    const totalCategories = await this.CategoryModel.countDocuments({is_active:1});
    const result = await this.CategoryModel.aggregate([
      {
        $lookup: {
          from: 'templates',
          localField: '_id',
          foreignField: 'cat_id',
          as: 'templates',
        },
      },
      {
        $unwind: {
          path: '$templates',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { 'templates.createdAt': -1 },
      },
      {
        $skip:skip,
      },
      {
        $group: {
          _id: '$_id',
          cat_name: { $first: '$cat_name' },
          is_active: { $first: '$is_active' },
          latestTemplates: { $push: '$templates.after_image_url' },
        },
      },
      {
        $project: {
          _id: 0,
          cat_id: '$_id',
          cat_name: 1,
          is_active: 1,
          latestTemplates: { $slice: ['$latestTemplates', 5] },
        },
      },
    ]);
    
  return{
    success:true,
    StatusCode:HttpStatus.OK,
    data:{
      result,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / pageSize),
      pageSize
    }
  }    
  }
}
