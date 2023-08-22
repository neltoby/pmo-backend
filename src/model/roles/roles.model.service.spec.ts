import { Test, TestingModule } from '@nestjs/testing';
import { RolesModelService } from './roles.model.service';

describe('ModelService', () => {
  let service: RolesModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesModelService],
    }).compile();

    service = module.get<RolesModelService>(RolesModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
