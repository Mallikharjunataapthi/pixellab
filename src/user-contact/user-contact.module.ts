import { Module } from '@nestjs/common';
import { UserContactService } from './user-contact.service';
import { UserContactController } from './user-contact.controller';
import { UserContact, UserContactSchema } from './schema/user-contact.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserContact.name,
        schema: UserContactSchema,
      },
    ]),
  ],
  controllers: [UserContactController],
  providers: [UserContactService],
  exports: [UserContactService, MongooseModule],
})
export class UserContactModule {}
