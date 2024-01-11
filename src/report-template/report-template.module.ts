import { Module, forwardRef } from '@nestjs/common';
import { ReportTemplateService } from './report-template.service';
import { ReportTemplateController } from './report-template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportTemplate, ReportTemplateSchemaSchema } from './schema/reporttemplate.schema';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports:[
    TemplatesModule,UsersModule,
    MongooseModule.forFeature([{
      name:ReportTemplate.name,
      schema:ReportTemplateSchemaSchema 
    }])
  ],
  controllers: [ReportTemplateController],
  providers: [ReportTemplateService],
})
export class ReportTemplateModule {}
