import { Module, forwardRef } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './Schema/template.schema';
import { FileUploadMiddleware } from 'src/common/fileupload.middleware';
import { CategoryModule } from 'src/category/category.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports:[
    TagsModule,
    MongooseModule.forFeature([{
      name:Template.name,
      schema:TemplateSchema
    }]),
    forwardRef(() => CategoryModule),
  ],
  controllers: [
    TemplatesController],
  providers: [TemplatesService,FileUploadMiddleware],
  exports: [TemplatesService,MongooseModule],
})
export class TemplatesModule {}
