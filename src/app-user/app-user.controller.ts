import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Public } from 'src/common/public.middleware';
import { ApiTags, ApiOperation ,ApiExcludeEndpoint } from '@nestjs/swagger';
@ApiTags('app-user')
@Controller('app-user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}
  @Public()
  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user and login' })
  create(@Body() createAppUserDto: CreateAppUserDto) {
    return this.appUserService.create(createAppUserDto);
  }

  @Get()
  @ApiExcludeEndpoint()
  findAll() {
    return this.appUserService.findAll();
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  findOne(@Param('id') id: string) {
    return this.appUserService.findOne(+id);
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateAppUserDto: UpdateAppUserDto) {
    return this.appUserService.update(+id, updateAppUserDto);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.appUserService.remove(+id);
  }
}
