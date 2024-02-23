import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { User } from 'src/users/Schemas/users.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Apps } from 'src/apps/schema/apps.schema';
@Injectable()
export class AppUserService {
  constructor(
    @InjectModel(Apps.name) private AppsModel: Model<Apps>,
    @InjectModel(User.name) private UserModel: Model<User>,


  ){}
  async create(createAppUserDto: CreateAppUserDto) {

    try{
      if( createAppUserDto?.app_id.length == 24 ){
        const appid = createAppUserDto.app_id;
        const AppName = await this.AppsModel.findById(appid);
        if (AppName != undefined && AppName != null && AppName.app_name != undefined && AppName.app_name != null) {
          const createUser = {...createAppUserDto ,app_name:AppName.app_name}
        const  existingUserDetails = await this.UserModel.findOne({
            app_id: createAppUserDto.app_id,
            email: createAppUserDto.email,
          });
          if(existingUserDetails != undefined && existingUserDetails !=null){
            return {
              success: true,
              StatusCode:HttpStatus.OK,
              message: 'User found',
              userId: existingUserDetails._id,
            };
          } else {
            const createdUserId = await this.UserModel.create(createUser);
            return {
              success: true,
              StatusCode:HttpStatus.OK,
              message: 'User Name Created',
              userId: createdUserId._id,
            };
          }
        } else {
          return {
            success: false,
            StatusCode:HttpStatus.BAD_REQUEST,
            message: 'App Id Not Found',
          };

        }
      }else{
        return {
          success: false,
          StatusCode:HttpStatus.BAD_REQUEST,
          message: 'App Id Is Worng',
        };
      }
    }catch(err:any){
      if (err.message == 'user already exists' || err.code === 11000) {
        return {
          success: false,
          StatusCode:HttpStatus.BAD_REQUEST,
          message: 'User Name already exists',
        };
      }
      throw  new Error(err);
    }
  }

  findAll() {
    return `This action returns all appUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appUser`;
  }

  update(id: number, updateAppUserDto: UpdateAppUserDto) {
    return `This action updates a #${id} appUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} appUser`;
  }
}
