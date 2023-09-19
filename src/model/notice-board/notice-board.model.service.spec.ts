import { Test, TestingModule } from '@nestjs/testing';
import { NoticeBoardModelService } from './notice-board.model.service';

describe('NoticeBoardModelService', () => {
  let service: NoticeBoardModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticeBoardModelService],
    }).compile();

    service = module.get<NoticeBoardModelService>(NoticeBoardModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
