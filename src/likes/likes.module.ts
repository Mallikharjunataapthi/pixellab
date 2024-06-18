import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Likes, LikesSchema } from './Schemas/likes.schemas';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TemplatesModule,
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Likes.name,
        schema: LikesSchema,
      },
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
