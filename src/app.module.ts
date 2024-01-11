import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { TemplatesModule } from './templates/templates.module';
import { LikesModule } from './likes/likes.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
// import { PassportModule } from '@nestjs/passport';
// import { jwtConstants } from './auth/constants';
import { TagsModule } from './tags/tags.module';
import { UserTemplatesModule } from './user-templates/user-templates.module';
import { ReportTemplateModule } from './report-template/report-template.module';
import { AdminReportModule } from './admin-report/admin-report.module';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  UsersModule,MongooseModule.forRoot(process.env.DB_URI), AuthModule, CategoryModule, TemplatesModule, LikesModule, TagsModule, UserTemplatesModule, ReportTemplateModule, AdminReportModule],
  controllers: [AppController],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },AppService,],
})
export class AppModule {}
