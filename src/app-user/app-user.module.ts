import { AppUserService } from './app-user.service';
import { AppUserController } from './app-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from 'src/users/Schemas/users.schema';
import { AppsModule } from 'src/apps/apps.module';
import { UsersModule } from 'src/users/users.module';
import { Module, forwardRef } from '@nestjs/common';
@Module({
  imports:[
    UsersModule,
    MongooseModule.forFeature([{
    name: User.name,
    schema:UserSchema
  }]),
  forwardRef(() => AppsModule),
 

  ],
  controllers: [AppUserController],
  providers: [AppUserService],
  exports: [AppUserService,MongooseModule],
})
export class AppUserModule {}
