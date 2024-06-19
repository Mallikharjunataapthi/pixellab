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
  async findAll(
    page: number = 0,
    pageSize: number = 10,
    searchName: string = '',
  ) {
    const filter: {
      $or?: { username?: { $regex: string; $options: 'i' };
              webname?: { $regex: string; $options: 'i' };
              email?: { $regex: string; $options: 'i' } 
            }[];
    } = {};

    if (searchName !== '') {
      filter.$or = [
        { username: { $regex: searchName, $options: 'i' } },
        { email: { $regex: searchName, $options: 'i' } },
        { webname: { $regex: searchName, $options: 'i' } },
      ];
    }
    try {
      const skip = (page - 1) * pageSize;
      const result = await this.UserContactSchemaModel.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(pageSize)
       // .populate('app_id', 'app_name');
      const totalCategories = await this.UserContactSchemaModel.countDocuments(filter);
      if (result) {
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          data: {
            result,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / pageSize),
            pageSize,
          },
        };
      } else {
        return {
          success: true,
          StatusCode: HttpStatus.NOT_FOUND,
          data: {
            result,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / pageSize),
            pageSize,
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        StatusCode: HttpStatus.BAD_REQUEST,
        message: 'User Contact Details Fetching failed',
      };
    }
  }
}
