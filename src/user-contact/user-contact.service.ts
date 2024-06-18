import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserContactDto } from './dto/create-user-contact.dto';
import { UserContact } from './schema/user-contact.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserContactService {
  constructor(
    @InjectModel(UserContact.name)
    private UserContactSchemaModel: Model<UserContact>,
  ) {}

  async create(createUserContactAppDto: CreateUserContactDto) {
    try {
      // const userIpCnt = await this.UserContactSchemaModel.findOne({ ip: createUserIpAppDto});
      await this.UserContactSchemaModel.create(createUserContactAppDto);
      return {
        success: true,
        StatusCode: HttpStatus.CREATED,
        message: `Successfully added`,
        count: 1,
      };
    } catch (error: any) {
      return {
        success: false,
        StatusCode: HttpStatus.BAD_REQUEST,
        message: `Failed added`,
        count: 1,
      };
    }
  }
  async findAll(user_ip: string = '') {
    try {
      const userIpCnt = await this.UserContactSchemaModel.findOne({
        ip: user_ip,
      });

      return {
        success: true,
        StatusCode: HttpStatus.OK,
        message: `fetched`,
        result: 0,
      };
    } catch (error) {
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        message: `fetched`,
        result: 0,
      };
    }
  }
}
