import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserIpDto } from './dto/create-user-ip.dto';
import { UserIp } from './schema/user-ip.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserIpService {
  constructor(
    @InjectModel(UserIp.name) private UserIpSchemaModel: Model<UserIp>,
  
  ){}

  async create(createUserIpAppDto: CreateUserIpDto) {
    try {
      const userIpCnt = await this.UserIpSchemaModel.findOne({ ip: createUserIpAppDto.ip });
  
      let usercnt = 0;
  
      if (!userIpCnt) {
       const  UsertempalteObject = {...createUserIpAppDto,template_count:1};
          await this.UserIpSchemaModel.create(UsertempalteObject);
          return {
            success: false,
            StatusCode: HttpStatus.CREATED,
            message: `Successfully added`,
            count: 1,
        };
      } else {
          if (userIpCnt.template_count !== undefined &&  Number(userIpCnt.template_count)  < 4) {
              await this.UserIpSchemaModel.updateOne(
                  { ip: createUserIpAppDto.ip },
                  { $inc: { template_count: 1 } }
              );
              usercnt = Number(userIpCnt.template_count) + 1;
              return {
                success: false,
                StatusCode: HttpStatus.CREATED,
                message: `Successfully updated`,
                count: usercnt,
            };
          } else {
              return {
                  success: true,
                  StatusCode: HttpStatus.CREATED,
                  message: `exceed limit of templates used`,
                  count: 3,
              };
          }
      }
  
     
  } catch (error: any) {
      throw new Error(error);
  }
  
}
  async findAll(user_ip:string='') {
    try {

      const userIpCnt = await this.UserIpSchemaModel.findOne({ ip: user_ip });
      if(userIpCnt.template_count != undefined && userIpCnt.template_count != null){
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          message:`fetched`,
          result: userIpCnt.template_count
        }
      } else {
        return {
          success:true,
          StatusCode:HttpStatus.OK,
          message:`fetched`,
          result: 0,
        }
      }
    } catch (error) {
      return {
        success:true,
        StatusCode:HttpStatus.OK,
        message:`fetched`,
          result: 0,
      }
    }
  }
  
}
