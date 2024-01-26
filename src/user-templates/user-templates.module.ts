import { Module, forwardRef} from '@nestjs/common';
import { UserTemplatesService } from './user-templates.service';
import { UserTemplatesController } from './user-templates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTemplate, UserTemplateSchema } from './schema/usertemplate.schema.js';
import { TemplatesModule } from 'src/templates/templates.module';
import { TemplateUsersReport, TemplateUserReportSchema } from './schema/usertemplatescount.schema';
import { AppsModule } from 'src/apps/apps.module';
@Module({
  imports:[
    TemplatesModule,
    MongooseModule.forFeature([{
      name:UserTemplate.name,
      schema:UserTemplateSchema
    }]),
    MongooseModule.forFeature([{
      name:TemplateUsersReport.name,
      schema:TemplateUserReportSchema
    }]),
    forwardRef(() => AppsModule),
  ],
  
  controllers: [UserTemplatesController],
  providers: [UserTemplatesService],
  exports: [UserTemplatesService,MongooseModule],
})
export class UserTemplatesModule {}
