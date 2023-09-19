import { Test, TestingModule } from '@nestjs/testing';
import { NoticeBoardController } from './notice-board.controller';
import { NoticeBoardService } from './notice-board.service';

describe('NoticeBoardController', () => {
  let controller: NoticeBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeBoardController],
      providers: [NoticeBoardService],
    }).compile();

    controller = module.get<NoticeBoardController>(NoticeBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
