import { Test, TestingModule } from '@nestjs/testing';
import { UserTemplatesService } from './user-templates.service';

describe('UserTemplatesService', () => {
  let service: UserTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTemplatesService],
    }).compile();

    service = module.get<UserTemplatesService>(UserTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
