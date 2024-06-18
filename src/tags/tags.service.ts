import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { tags } from './schema/tags.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class TagsService {
  constructor(@InjectModel(tags.name) private tagsModel: Model<tags>) {}

  async create(createTagDto: CreateTagDto) {
    try {
      await this.tagsModel.create(createTagDto);
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        message: 'Tag Created Successfully',
      };
    } catch (err: any) {
      if (err.code === 11000) {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'Tag already exists',
        };
      }
      if (err.message === 'Tag already exists') {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'Tag already exists',
        };
      }
      throw new Error(err);
    }
  }

  async findAll(
    page: number = 0,
    pageSize: number = 10,
    searchApp: string = '',
  ) {
    const filter: {
      app_id?: string;
    } = {};
    if (searchApp != '') {
      filter.app_id = searchApp;
    }
    try {
      const skip = (page - 1) * pageSize;
      const result = await this.tagsModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('app_id', 'app_name');
      const totalTags = await this.tagsModel.countDocuments(filter);
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        data: {
          result,
          currentPage: page,
          totalPages: Math.ceil(totalTags / pageSize),
          pageSize,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getalltags(app_id: string) {
    try {
      const filter: {
        app_id: any;
        is_active: any; // Make 'user_id' property optional
      } = {
        app_id: app_id,
        is_active: 1,
      };
      const result = await this.tagsModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .populate('app_id', 'app_name');
      const totalTags = await this.tagsModel.countDocuments(filter);
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        data: { result },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findOne(id: string) {
    try {
      const result = await this.tagsModel.findById(id);
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    // this flag used to validate schema for update operations
    const opts = { runValidators: true };
    const updateObj: CreateTagDto = {
      app_id: updateTagDto.app_id,
      tag_name: updateTagDto.tag_name,
      is_active: updateTagDto.is_active,
    };
    const result = await this.tagsModel.updateOne({ _id: id }, updateObj, opts);
    return result;
  }

  async remove(id: string) {
    try {
      const result = await this.tagsModel.findOneAndDelete({ _id: id });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllActiveList() {
    try {
      const result = await this.tagsModel
        .find({ is_active: 1 })
        .sort({ updatedAt: -1 });
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        data: { result },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findAllActiveAppList(id: string) {
    try {
      const result = await this.tagsModel
        .find({ is_active: 1, app_id: id })
        .sort({ updatedAt: -1 });
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        data: { result },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
