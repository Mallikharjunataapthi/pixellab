import { Model, Types } from 'mongoose';
import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './Schemas/users.schema';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ){}
  async create(createUserDto: CreateUserDto) {
      const data = await this.UserModel.create(createUserDto);
       return data;
  }

  // async login(username:String, password:String){
  //   const user = await this.UserModel.findOne({ username: username });
  //   if (!user) {
  //     return {
  //       message: 'User not found',
  //       StatusCode: HttpStatus.NOT_FOUND,
  //     };
  //   }
  //   const passwordMatch = await bcrypt.compare(password, user.password);

  //   if (!passwordMatch) {
  //     return {
  //       message: 'Invalid password',
  //       StatusCode: HttpStatus.UNAUTHORIZED,
  //     };
  //   }
  //     const payload = { sub: user._id, username: user.username };
  //     const access_token = await this.jwtService.signAsync(payload);
  //   return {
  //     message: 'Login successful',
  //     access_token,
  //     StatusCode: HttpStatus.OK,
  //   };
  // }
  async checkUser(username:String){
    const user = await this.UserModel.findOne({ username });
    return user;
  }

  async findAll(page:number=0,pageSize:number=10,searchApp:string = '',searchName:string = '') {
    try{
      const skip = (page - 1) * pageSize;
      const filter: {
        username?: { $regex: string, $options: 'i' };
        app_id?: string;
        
      } = {
        
      };

      if(searchName != ''){
        filter.username = { $regex: searchName, $options: 'i' };
      }
      if(searchApp != ''){
        filter.app_id = searchApp;
      }
      const data = await this.UserModel.find(filter).sort({updatedAt:-1}).skip(skip).limit(pageSize).populate('app_id','app_name');
      const totalUsers = await this.UserModel.countDocuments(filter);
      return{
        success: true,
        StatusCode:HttpStatus.OK,
        data:{data,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / pageSize),
          pageSize}
      }
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: Types.ObjectId) {
    try{
      const result = await this.UserModel.findById(id);
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
  async getAllAdminUsers(appId:string ,page:number=0,pageSize:number=10) {
    try{
      const skip = (page - 1) * pageSize;
      const data = await this.UserModel.find({app_id:appId,role_id:2}).sort({updatedAt:-1});
      const totalUsers = await this.UserModel.countDocuments({app_id:appId});
      return{
        success: true,
        StatusCode:HttpStatus.OK,
        data:{data,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / pageSize),
          pageSize}
      }
    }
    catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string,updateUserDto: UpdateUserDto) {
    if(updateUserDto.role_id !== '0') {
      const existingUser = await this.UserModel.findOne({
          app_id: updateUserDto.app_id,
          email: updateUserDto.email,
          _id: { $ne: id },
      });
      if(existingUser){
        return 'User Already Exists' ;
      }
      
    } else {
      const existingUser = await this.UserModel.findOne({
        username:updateUserDto.username,
        _id: { $ne: new Types.ObjectId(id)},
        app_id: { $exists: false },
      });
      
      if(existingUser){
        return 'User Already Exists';
      }
    }
    const data = await this.UserModel.updateOne({_id:id},updateUserDto);
    return data;
  }
}
