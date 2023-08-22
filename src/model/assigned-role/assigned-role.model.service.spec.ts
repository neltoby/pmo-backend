import { Test, TestingModule } from '@nestjs/testing';
import { AssignedRoleModelService } from './assigned-role.model.service';

describe('ModelService', () => {
  let service: AssignedRoleModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignedRoleModelService],
    }).compile();

    service = module.get<AssignedRoleModelService>(AssignedRoleModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
