import { Test, TestingModule } from '@nestjs/testing';
import { InviteUserModelService } from './inviteuser.model.service';

describe('InviteUserModelService', () => {
  let service: InviteUserModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteUserModelService],
    }).compile();

    service = module.get<InviteUserModelService>(InviteUserModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
