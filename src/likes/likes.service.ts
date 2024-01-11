import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Likes } from './Schemas/likes.schemas';
import { Model } from 'mongoose';
import { Template } from 'src/templates/Schema/template.schema';
import { User } from 'src/users/Schemas/users.schema';
@Injectable()
export class LikesService { 
  constructor(
    @InjectModel(Likes.name) private LikesModel: Model<Likes>,
    @InjectModel(Template.name) private TemplateModel: Model<Template>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ){}
  
  async checkUserLike(createLikeDto: CreateLikeDto) {
    try{
      const returndata = await this.LikesModel.findOne({user_id:createLikeDto.user_id, template_id:createLikeDto.template_id});
      return {
        success:true,
        message:returndata
      };;
    }catch(error){
      return {
        success:false,
        message:error
      };
    }
  } 
 async checkUserAndTemplateById(createLikeDto: CreateLikeDto) {
    try{
      const userexist  = await this.UserModel.findById(createLikeDto.user_id);
      if(!userexist){
        return{
          success:false,
          StatusCode:HttpStatus.NOT_FOUND,
          message:'User Not Exist'
        }
      }
      const templateexist  = await this.TemplateModel.findById(createLikeDto.template_id);
      if(!templateexist){
        return{
          success:false,
          StatusCode:HttpStatus.NOT_FOUND,
          message:'Template Not Exist'
        }
      }
      return{
        success:true,
        StatusCode:HttpStatus.OK,
        message:'',
      }

    }catch(error){
      throw new InternalServerErrorException(error);
    }
  }
 async create(createLikeDto: CreateLikeDto) {
    try{
      await  this.LikesModel.create(createLikeDto);
      await this.updateLikesCount(createLikeDto, +1);
      return { 
        success:true,
        StatusCode:HttpStatus.OK,
        message:'Liked Successfully'
      }
    }catch(error){
      throw new InternalServerErrorException(error)
    }
  }

  async remove(createLikeDto:CreateLikeDto) {
    try{
      await  this.LikesModel.findOneAndDelete(createLikeDto);
      this.updateLikesCount(createLikeDto,-1);
      return {
        success:true,
        StatusCode:HttpStatus.OK,
        message:'Like Removed Successfully'
      }
    }catch(error){
      throw new InternalServerErrorException(error)
    }
  }
  async updateLikesCount(createCategoryDto:CreateLikeDto, counter:number){
    await this.TemplateModel.updateOne({ _id: createCategoryDto.template_id }, { $inc:{wishlist_count: counter }});
  }
}
