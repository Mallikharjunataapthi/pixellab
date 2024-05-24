import { Module } from '@nestjs/common';
import { UserIpService } from './user-ip.service'; 
import { UserIpController } from './user-ip.controller';
import { UserIp,UserIpSchema } from './schema/user-ip.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports:[
    MongooseModule.forFeature([{
      name: UserIp.name,
      schema: UserIpSchema
    }]), 
  ],
  controllers: [UserIpController],
  providers: [UserIpService],
  exports: [UserIpService,MongooseModule],
})
export class UserIpModule {}
