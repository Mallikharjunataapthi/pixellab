import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from "bcrypt"
import { UsersService } from 'src/users/users.service';
import { Model, Types } from 'mongoose';
import { Apps } from 'src/apps/schema/apps.schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AuthService {
    constructor(
      @InjectModel(Apps.name) private AppsModel: Model<Apps>,
        private usersService: UsersService,
        private jwtService: JwtService,
      ){}
    async create(createUserDto: CreateUserDto) {
      try{
        const {password, ...Userdata} = createUserDto;
        const hasedpassword = await bcrypt.hash(password,10);
        let createUser;
        if(createUserDto.app_id != undefined && createUserDto.app_id != null){

        }
        if( createUserDto?.app_id.length == 24 ){
            const appid = createUserDto.app_id;
            const AppName = await this.AppsModel.findById(appid);
            if (AppName != undefined && AppName != null && AppName.app_name != undefined && AppName.app_name != null) {
              createUser = { ...Userdata,password:hasedpassword,role_id:2,app_name:AppName.app_name }
              await this.usersService.create(createUser);
            }else{
              return {
                success: false,
                StatusCode:HttpStatus.BAD_REQUEST,
                message: 'App Name not exists',
              };
            }
          }else {
            createUser = { ...Userdata,password:hasedpassword,role_id:0 }
            await this.usersService.create(createUser);
          }

        
        return {
          success: true,
          StatusCode:HttpStatus.OK,
          message: 'User Name Created',
        };
      }catch(err:any){
        if (err.code === 11000 || err.message == 'user already exists') {
          return {
            success: false,
            StatusCode:HttpStatus.BAD_REQUEST,
            message: 'User Name already exists',
          };
        }
        throw  new Error(err);
      }
    }
  
    async login(username:String, password:String){
      const user = await this.usersService.checkUser(username);
      if (!user) {
        return {
          success:false,
          message: 'Invalid User',
          StatusCode: HttpStatus.NOT_FOUND,
        };
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return {
          success:false,
          message: 'Invalid password',
          StatusCode: HttpStatus.UNAUTHORIZED,
        };
      }
        const payload = { sub: user._id, username: user.username};
        const access_token = await this.jwtService.signAsync(payload);
      return {
        user_id:user._id.toString(),
        success:true,
        message: 'Login successful',
        access_token,
        StatusCode: HttpStatus.OK,
      };
    }

    async validateUser(username:String, password:String){
        const Userdata =  await this.usersService.checkUser(username);
        if(!Userdata){
          return null
        }
        const passwordMatch = await bcrypt.compare(password, Userdata.password);
        if(!passwordMatch){
          return null
        }
        return Userdata;
    }


}
