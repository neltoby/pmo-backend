import { Test, TestingModule } from '@nestjs/testing';
import { ParastatalsModelService } from './parastatals.model.service';

describe('InviteUserModelService', () => {
  let service: ParastatalsModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParastatalsModelService],
    }).compile();

    service = module.get<ParastatalsModelService>(ParastatalsModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
