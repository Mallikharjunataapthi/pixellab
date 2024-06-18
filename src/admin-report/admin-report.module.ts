import { Module } from '@nestjs/common';
import { AdminReportService } from './admin-report.service';
import { AdminReportController } from './admin-report.controller';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { UserTemplatesModule } from 'src/user-templates/user-templates.module';
@Module({
  imports: [TemplatesModule, UsersModule, UserTemplatesModule],
  controllers: [AdminReportController],
  providers: [AdminReportService],
})
export class AdminReportModule {}
