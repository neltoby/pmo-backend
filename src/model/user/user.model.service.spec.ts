import { Test, TestingModule } from '@nestjs/testing';
import { UserModelService } from './user.model.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';

describe('UserModelService', () => {
  let service: UserModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserModelService,
        { provide: getModelToken(User.name), useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<UserModelService>(UserModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
