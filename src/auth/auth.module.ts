import { Module } from '@nestjs/common';
import { ConfigModule  } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports:[ConfigModule,
  UsersModule,
  PassportModule,
  JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10h' },
 
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
