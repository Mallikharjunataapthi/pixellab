import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Response } from 'express';
import { Public } from 'src/common/public.middleware';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @Public()
  @Post()
  @ApiOperation({ summary: 'User likes the template' })
  async create(
    @Body() createLikeDto: CreateLikeDto,
    @Res() response: Response,
  ) {
    // check already liked
    try {
      const checkUser =
        await this.likesService.checkUserAndTemplateById(createLikeDto);
      if (checkUser.success) {
        const isLiked = await this.likesService.checkUserLike(createLikeDto);
        let result = {
          success: false,
          StatusCode: HttpStatus.BAD_REQUEST,
          message: '',
        };
        if (isLiked.success && !isLiked.message) {
          result = await this.likesService.create(createLikeDto);
        } else if (isLiked.success && isLiked.message) {
          result = await this.likesService.remove(createLikeDto);
        }
        if (result) {
          return response.status(result.StatusCode).json(result);
        } else {
          return {
            success: false,
            StatusCode: HttpStatus.BAD_REQUEST,
            message: 'Like UnSuccessfully',
          };
        }
      } else {
        return response.status(checkUser.StatusCode).json(checkUser);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
