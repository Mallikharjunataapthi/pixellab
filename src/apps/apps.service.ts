import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { Apps } from './schema/apps.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Template } from 'src/templates/Schema/template.schema';

@Injectable()
export class AppsService {
  constructor(
    @InjectModel(Apps.name) private AppsSchemaModel: Model<Apps>,
    @InjectModel(Template.name) private TemplateModel: Model<Apps>,
  ) {}
  async create(createAppDto: CreateAppDto) {
    try {
      await this.AppsSchemaModel.create(createAppDto);
      return {
        success: true,
        StatusCode: HttpStatus.CREATED,
        messgae: `successfully added`,
      };
    } catch (error: any) {
      if (error.code === 11000) {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'App already exists',
        };
      }
      throw new Error(error);
    }
  }

  async findAll(page: number = 0, pageSize: number = 10) {
    try {
      const skip = (page - 1) * pageSize;
      const data = await this.AppsSchemaModel.find()
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(pageSize);
      const totalPages = await this.AppsSchemaModel.countDocuments();
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        message: `fetched`,
        result: {
          result: data,
          currentPage: page,
          totalPages: Math.ceil(totalPages / pageSize),
          pageSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        StatusCode: HttpStatus.BAD_REQUEST,
        message: `something went wrong`,
        data: null,
      };
    }
  }

  async findOne(id: mongoose.Types.ObjectId) {
    return await this.AppsSchemaModel.findOne({ _id: id });
  }

  async remove(id: mongoose.Types.ObjectId) {
    try {
      const deleteddata = await this.AppsSchemaModel.findOneAndDelete({
        _id: id,
      });
      await this.DeleteappsinTemplate(deleteddata);
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      return {
        success: false,
        StatusCode: HttpStatus.BAD_REQUEST,
        message: 'Deleted Failed',
      };
    }
  }

  async DeleteappsinTemplate(result: any) {
    try {
      // Update documents to remove the specified value from the 'apps' array
      const data = await this.TemplateModel.updateMany(
        { apps: result.app_name },
        { $pull: { apps: result.app_name } },
      );

      return data;
    } catch (error) {
      // Log the error for debugging
      console.error('Error during DeleteappsinTemplate:', error);
      throw new Error(`Something went wrong: ${error}`);
    }
  }
}
