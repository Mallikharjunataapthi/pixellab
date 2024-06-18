import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { User } from 'src/users/Schemas/users.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Apps } from 'src/apps/schema/apps.schema';
import { FileUploadMiddleware } from 'src/common/fileupload.middleware';
@Injectable()
export class AppUserService {
  constructor(
    @InjectModel(Apps.name) private AppsModel: Model<Apps>,
    @InjectModel(User.name) private UserModel: Model<User>,
    private fileuploader: FileUploadMiddleware,
  ) {}
  async create(
    createAppUserDto: CreateAppUserDto,
    files: { profile_img?: Express.Multer.File[] },
  ) {
    try {
      const ImageFile = files?.profile_img ? files?.profile_img[0] : null;
      let ImageS3Response = null;
      if (ImageFile != null) {
        ImageS3Response = await this.fileuploader.s3_upload(ImageFile);
      }
      if (createAppUserDto?.app_id.length == 24) {
        const appid = createAppUserDto.app_id;
        const AppName = await this.AppsModel.findById(appid);
        if (
          AppName != undefined &&
          AppName != null &&
          AppName.app_name != undefined &&
          AppName.app_name != null
        ) {
          if (ImageS3Response) {
            createAppUserDto.profile_img = ImageS3Response;
          }
          const createUser = {
            ...createAppUserDto,
            app_name: AppName.app_name,
          };

          const existingUserDetails = await this.UserModel.findOne({
            app_id: createAppUserDto.app_id,
            email: createAppUserDto.email,
          });
          if (existingUserDetails != undefined && existingUserDetails != null) {
            if (existingUserDetails.is_active == '0') {
              return {
                success: true,
                StatusCode: HttpStatus.OK,
                message: 'User Blocked. Please Contact Administrator',
                userId: existingUserDetails._id,
              };
            }
            const existingUserupdate = await this.UserModel.updateOne(
              { _id: new Types.ObjectId(existingUserDetails.id) },
              {
                app_id: createUser.app_id,
                app_name: createUser.app_name,
                email: createUser.email,
                profile_img: createUser.profile_img,
                username: createUser.username,
              },
            );
            existingUserupdate;
            return {
              success: true,
              StatusCode: HttpStatus.OK,
              message: 'User Exists',
              userId: existingUserDetails._id,
            };
          } else {
            const createdUserId = await this.UserModel.create(createUser);
            return {
              success: true,
              StatusCode: HttpStatus.OK,
              message: 'User Name Created',
              userId: createdUserId._id,
            };
          }
        } else {
          return {
            success: false,
            StatusCode: HttpStatus.BAD_REQUEST,
            message: 'App Id Not Found',
          };
        }
      } else {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'App Id Is Worng',
        };
      }
    } catch (err: any) {
      if (err.message == 'user already exists' || err.code === 11000) {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'User Name already exists',
        };
      }
      throw new Error(err);
    }
  }

  findAll() {
    return `This action returns all appUser`;
  }

  async findOne(user_id: string, app_id: string) {
    try {
      if (app_id.length == 24) {
        const appid = app_id;
        const AppName = await this.AppsModel.findById(appid);
        if (
          AppName != undefined &&
          AppName != null &&
          AppName.app_name != undefined &&
          AppName.app_name != null
        ) {
          try {
            const result = await this.UserModel.findById(user_id);
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
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  update(id: number, updateAppUserDto: UpdateAppUserDto) {
    return `This action updates a #${id} appUser`;
  }

  async remove(id: string) {
    try {
      const result = await this.UserModel.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          message: 'User deleted successfully',
        };
      } else {
        return {
          success: false,
          StatusCode: HttpStatus.NOT_FOUND,
          message: 'User delete failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
}
