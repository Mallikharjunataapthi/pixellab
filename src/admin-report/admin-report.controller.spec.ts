import { Test, TestingModule } from '@nestjs/testing';
import { AdminReportController } from './admin-report.controller';
import { AdminReportService } from './admin-report.service';

describe('AdminReportController', () => {
  let controller: AdminReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminReportController],
      providers: [AdminReportService],
    }).compile();

    controller = module.get<AdminReportController>(AdminReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
