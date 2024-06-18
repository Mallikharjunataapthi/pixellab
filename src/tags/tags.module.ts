import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { tags, tagsSchema } from './schema/tags.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: tags.name,
        schema: tagsSchema,
      },
    ]),
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService, MongooseModule],
})
export class TagsModule {}
