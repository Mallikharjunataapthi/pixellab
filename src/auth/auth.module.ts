import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppsModule } from 'src/apps/apps.module';
import { FileUploadMiddleware } from 'src/common/fileupload.middleware';
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: '10h' },
    }),
    forwardRef(() => AppsModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, FileUploadMiddleware],
})
export class AuthModule {}
