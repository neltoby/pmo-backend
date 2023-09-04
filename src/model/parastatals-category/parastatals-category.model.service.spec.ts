import { Test, TestingModule } from '@nestjs/testing';
import { ParastatalsCategoryModelService } from './parastatals-category.model.service';

describe('ParastatalsCategoryModelService', () => {
  let service: ParastatalsCategoryModelService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParastatalsCategoryModelService],
    }).compile();

    service = module.get<ParastatalsCategoryModelService>(
      ParastatalsCategoryModelService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
