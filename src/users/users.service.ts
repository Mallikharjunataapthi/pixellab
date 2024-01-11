import { Model, Types } from 'mongoose';
import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './Schemas/users.schema';
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

  async findAll() {
    try{
      const data = await this.UserModel.find().sort({updatedAt:-1});
      return {
        success:true,
        StatusCode:HttpStatus.CREATED,
        data: data
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
}
