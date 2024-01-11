import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';
import { TemplatesModule } from 'src/templates/templates.module';

@Module({
    imports:[
      MongooseModule.forFeature([{
      name: Category.name,
      schema:CategorySchema
    }]),
    forwardRef(() => TemplatesModule),
    ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService,MongooseModule],
})
export class CategoryModule {}
