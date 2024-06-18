import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/category.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileUploadMiddleware } from 'src/common/fileupload.middleware';
import { Template } from 'src/templates/Schema/template.schema';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    @InjectModel(Template.name) private TemplateModel: Model<Template>,
    private fileuploader: FileUploadMiddleware,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    files: { image_url?: Express.Multer.File[] },
  ) {
    try {
      const ImageFile = files.image_url ? files.image_url[0] : null;
      let ImageS3Response = null;
      let newTemplateDto;
      if (ImageFile != null) {
        ImageS3Response = await this.fileuploader.s3_upload(ImageFile);
        newTemplateDto = {
          ...createCategoryDto,
          image_url: ImageS3Response ? ImageS3Response : null,
        };
      } else {
        newTemplateDto = createCategoryDto;
      }

      await this.CategoryModel.create(newTemplateDto);
      return {
        success: true,
        StatusCode: HttpStatus.OK,
        message: 'Category Created Successfully',
      };
    } catch (err: any) {
      if (err.code === 11000) {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'Category already exists',
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
      const result = await this.CategoryModel.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('app_id', 'app_name');
      const totalCategories = await this.CategoryModel.countDocuments(filter);
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
        message: 'Category Fetching failed',
      };
    }
  }
  async getAllcategories(app_id: string) {
    try {
      const filter: {
        app_id: any;
        is_active: any; // Make 'user_id' property optional
      } = {
        app_id: app_id,
        is_active: 1,
      };
      const result = await this.CategoryModel.find(filter)
        .sort({ updatedAt: -1 })
        .populate('app_id', 'app_name');
      //const totalCategories = await this.CategoryModel.countDocuments(filter);
      if (result) {
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          data: { result },
        };
      } else {
        return {
          success: true,
          StatusCode: HttpStatus.NOT_FOUND,
          data: { result },
        };
      }
    } catch (error) {
      return {
        success: false,
        StatusCode: HttpStatus.BAD_REQUEST,
        message: 'Category Fetching failed',
      };
    }
  }
  async getActiveCategories() {
    try {
      const result = await this.CategoryModel.find({ is_active: '1' }).sort({
        updatedAt: -1,
      });
      if (result) {
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          data: { result },
        };
      } else {
        return {
          success: true,
          StatusCode: HttpStatus.NOT_FOUND,
          data: { result },
        };
      }
    } catch (error) {
      return {
        success: false,
        StatusCode: HttpStatus.BAD_REQUEST,
        message: 'Category Fetching failed',
      };
    }
  }
  async getActiveAppCategories(id: string) {
    try {
      const result = await this.CategoryModel.find({
        is_active: '1',
        app_id: id,
      }).sort({ updatedAt: -1 });
      if (result) {
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          data: { result },
        };
      } else {
        return {
          success: true,
          StatusCode: HttpStatus.NOT_FOUND,
          data: { result },
        };
      }
    } catch (error) {
      return {
        success: false,
        StatusCode: HttpStatus.BAD_REQUEST,
        message: 'Category Fetching failed',
      };
    }
  }
  async findOne(id: string) {
    try {
      const result = await this.CategoryModel.findById(id);
      if (result) {
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          data: result,
        };
      } else {
        return {
          success: false,
          StatusCode: HttpStatus.NOT_FOUND,
          data: result,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    files: { image_url?: Express.Multer.File[] },
  ) {
    try {
      // this flag used to validate schema for update operations
      const opts = { runValidators: true };
      const newTemplateDto: any = {
        app_id: updateCategoryDto.app_id,
        cat_name: updateCategoryDto.cat_name,
        is_active: updateCategoryDto.is_active,
      };
      const ImageFile = files.image_url ? files.image_url[0] : null;
      let ImageS3Response = null;
      if (ImageFile) {
        const oldFilepath =
          await this.CategoryModel.findById(id).select('-_id image_url');
        if (oldFilepath && oldFilepath.image_url != null) {
          await this.fileuploader.delteS3File(oldFilepath?.image_url);
        }
        ImageS3Response = await this.fileuploader.s3_upload(ImageFile);
      } else {
        if (updateCategoryDto.image_url == undefined) {
          newTemplateDto.image_url = ImageS3Response;
        }
      }

      if (ImageS3Response) {
        newTemplateDto.image_url = ImageS3Response;
      }

      const result = await this.CategoryModel.findOneAndUpdate(
        { _id: id },
        newTemplateDto,
        opts,
      );
      if (result) {
        await this.updatecategory(id, updateCategoryDto);
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          message: 'Category Updated Successfully',
        };
      } else {
        return {
          StatusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Category id not found',
        };
      }
    } catch (error: any) {
      if (error.code === 11000) {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'Category already exists',
        };
      }
      if (error.message == 'Category already exists') {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        };
      }
      return {
        StatusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: error,
      };
    }
  }
  async updatecategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.TemplateModel.updateMany(
      { cat_id: new Types.ObjectId(id) },
      { category_name: updateCategoryDto.cat_name },
    );
  }

  async remove(id: string) {
    try {
      const result = await this.CategoryModel.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          message: 'Category deleted successfully',
        };
      } else {
        return {
          success: false,
          StatusCode: HttpStatus.NOT_FOUND,
          message: 'Category delete failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
  async findMobileCategories(app_id: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const totalCategories = await this.CategoryModel.countDocuments({
      is_active: 1,
      app_id: app_id,
    });
    const result = await this.CategoryModel.aggregate([
      {
        $match: {
          app_id: app_id,
          is_active: '1',
        },
      },
      {
        $lookup: {
          from: 'templates',
          localField: '_id',
          foreignField: 'cat_id',
          as: 'templates',
        },
      },
      {
        $unwind: {
          path: '$templates',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { 'templates.createdAt': -1 },
      },
      {
        $skip: skip,
      },
      {
        $group: {
          _id: '$_id',
          cat_name: { $first: '$cat_name' },
          is_active: { $first: '$is_active' },
          latestTemplates: { $push: '$templates.after_image_url' },
        },
      },
      {
        $project: {
          _id: 0,
          cat_id: '$_id',
          cat_name: 1,
          is_active: 1,
          app_id: app_id,
          latestTemplates: { $slice: ['$latestTemplates', 5] },
        },
      },
    ]);

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
  }
  async findCategory(
    app_id: string,
    cat_id: string,
    page: number,
    pageSize: number,
  ) {
    const filters: {
      is_active: any;
      app_id: any;
      _id?: any;
    } = {
      is_active: '1',
      app_id: app_id,
    };
    if (cat_id != null && cat_id != '') {
      filters._id = new Types.ObjectId(cat_id);
    }
    const skip = (page - 1) * pageSize;
    const totalCategories = await this.CategoryModel.countDocuments(filters);
    const result = await this.CategoryModel.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: 'templates',
          localField: '_id',
          foreignField: 'cat_id',
          as: 'templates',
        },
      },
      {
        $unwind: {
          path: '$templates',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { 'templates.createdAt': -1 },
      },
      {
        $skip: skip,
      },
      {
        $group: {
          _id: '$_id',
          cat_name: { $first: '$cat_name' },
          is_active: { $first: '$is_active' },
          latestTemplates: {
            $push: {
              id: '$templates._id',
              afterurl: '$templates.after_image_url',
              beforeurl: '$templates.before_image_url',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          cat_id: '$_id',
          cat_name: 1,
          is_active: 1,
          app_id: app_id,
          latestTemplates: { $slice: ['$latestTemplates', 10] },
        },
      },
    ]);

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
  }
}
