import { Test, TestingModule } from '@nestjs/testing';
import { ReportTemplateController } from './report-template.controller';
import { ReportTemplateService } from './report-template.service';

describe('ReportTemplateController', () => {
  let controller: ReportTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportTemplateController],
      providers: [ReportTemplateService],
    }).compile();

    controller = module.get<ReportTemplateController>(ReportTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
