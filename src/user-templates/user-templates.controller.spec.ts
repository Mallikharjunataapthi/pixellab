import { Test, TestingModule } from '@nestjs/testing';
import { UserTemplatesController } from './user-templates.controller';
import { UserTemplatesService } from './user-templates.service';

describe('UserTemplatesController', () => {
  let controller: UserTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTemplatesController],
      providers: [UserTemplatesService],
    }).compile();

    controller = module.get<UserTemplatesController>(UserTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
