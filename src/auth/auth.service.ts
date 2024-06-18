import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Model, Types } from 'mongoose';
import { Apps } from 'src/apps/schema/apps.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { FileUploadMiddleware } from 'src/common/fileupload.middleware';
import { User } from 'src/users/Schemas/users.schema';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Apps.name) private AppsModel: Model<Apps>,
    @InjectModel(User.name) private UserModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private fileuploader: FileUploadMiddleware,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...Userdata } = createUserDto;
      const hasedpassword = await bcrypt.hash(password, 10);
      let createUser;
      if (
        createUserDto.app_id != undefined &&
        createUserDto.app_id != null &&
        createUserDto?.app_id.length == 24
      ) {
        const appid = createUserDto.app_id;
        const AppName = await this.AppsModel.findById(appid);
        if (
          AppName != undefined &&
          AppName != null &&
          AppName.app_name != undefined &&
          AppName.app_name != null
        ) {
          createUser = {
            ...Userdata,
            password: hasedpassword,
            role_id: 2,
            app_name: AppName.app_name,
          };
          if (
            createUser.profile_img == undefined ||
            createUser.profile_img == null ||
            createUser.profile_img == ''
          ) {
            delete createUser.profile_img;
          }
          await this.usersService.create(createUser);
        } else {
          return {
            success: false,
            StatusCode: HttpStatus.BAD_REQUEST,
            message: 'App Name not exists',
          };
        }
      } else {
        createUser = { ...Userdata, password: hasedpassword };
        if (
          createUser.profile_img == undefined ||
          createUser.profile_img == null ||
          createUser.profile_img == ''
        ) {
          delete createUser.profile_img;
        }
        if (createUser.role_id == 0) {
          delete createUser.app_id;
          delete createUser.email;
        }
        await this.usersService.create(createUser);
      }

      return {
        success: true,
        StatusCode: HttpStatus.OK,
        message: 'User Name Created',
      };
    } catch (err: any) {
      if (err.code === 11000 || err.message == 'user already exists') {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'User Name already exists',
        };
      }
      throw new Error(err);
    }
  }

  async login(username: string, password: string, expiresIn: string = '10h') {
    const user = await this.usersService.checkUser(username);
    if (!user) {
      return {
        success: false,
        message: 'Invalid User',
        StatusCode: HttpStatus.NOT_FOUND,
      };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: 'Invalid password',
        StatusCode: HttpStatus.UNAUTHORIZED,
      };
    }
    const payload = { sub: user._id, username: user.username };
    const access_token = await this.jwtService.signAsync({}, { expiresIn });
    return {
      user_id: user._id.toString(),
      success: true,
      message: 'Login successful',
      access_token,
      StatusCode: HttpStatus.OK,
    };
  }

  async validateUser(username: string, password: string) {
    const Userdata = await this.usersService.checkUser(username);
    if (!Userdata) {
      return null;
    }
    const passwordMatch = await bcrypt.compare(password, Userdata.password);
    if (!passwordMatch) {
      return null;
    }
    return Userdata;
  }
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    files: { profile_img?: Express.Multer.File[] },
  ) {
    const opts = { runValidators: true };
    const { password, ...Userdata } = updateUserDto;
    const hasedpassword = await bcrypt.hash(password, 10);
    try {
      // this flag used to validate schema for update operations

      let createUser;

      if (
        updateUserDto?.app_id != undefined &&
        updateUserDto?.app_id != null &&
        updateUserDto?.app_id.length == 24
      ) {
        const appid = updateUserDto.app_id;
        const AppName = await this.AppsModel.findById(appid);
        if (
          AppName != undefined &&
          AppName != null &&
          AppName.app_name != undefined &&
          AppName.app_name != null
        ) {
          const ImageFile = files.profile_img ? files.profile_img[0] : null;
          let ImageS3Response = null;
          if (ImageFile) {
            const oldFilepath =
              await this.UserModel.findById(id).select('-_id profile_img');
            if (
              oldFilepath &&
              oldFilepath.profile_img != null &&
              oldFilepath.profile_img != ''
            ) {
              await this.fileuploader.delteS3File(oldFilepath?.profile_img);
            }
            ImageS3Response = await this.fileuploader.s3_upload(ImageFile);
          } else {
          }

          createUser = {
            ...Userdata,
            role_id: updateUserDto.role_id,
            app_name: AppName.app_name,
          };
          if (ImageS3Response) {
            createUser.profile_img = ImageS3Response;
          } else if (createUser.profile_img == undefined) {
            createUser.profile_img = '';
          } else {
            delete createUser.profile_img;
          }

          const updateUser = await this.usersService.update(
            id,
            createUser,
            opts,
          );
          if (updateUser == 'User Already Exists') {
            return {
              success: false,
              StatusCode: HttpStatus.BAD_REQUEST,
              message: 'User Already Exists',
            };
          }
        } else {
          return {
            success: false,
            StatusCode: HttpStatus.BAD_REQUEST,
            message: 'App not exists',
          };
        }
      } else {
        createUser = { ...Userdata, password: hasedpassword, role_id: 0 };
        await this.usersService.update(id, createUser, opts);
      }
    } catch (error: any) {
      if (error.code === 11000) {
        return {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: 'User already exists',
        };
      }
      if (error.message == 'User already exists') {
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
    return {
      success: true,
      StatusCode: HttpStatus.OK,
      message: 'User Updated',
    };
  }
}
