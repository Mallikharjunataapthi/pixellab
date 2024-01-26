import { Module } from '@nestjs/common';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { Apps,AppsSchema } from './schema/apps.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesModule } from 'src/templates/templates.module';
@Module({
  imports:[
    MongooseModule.forFeature([{
      name: Apps.name,
      schema: AppsSchema
    }]), TemplatesModule
  ],
  controllers: [AppsController],
  providers: [AppsService],
  exports: [AppsService,MongooseModule],
})
export class AppsModule {}
