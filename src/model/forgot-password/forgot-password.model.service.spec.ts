import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordModelService } from './forgot-password.model.service';

describe('ModelService', () => {
  let service: ForgotPasswordModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgotPasswordModelService],
    }).compile();

    service = module.get<ForgotPasswordModelService>(
      ForgotPasswordModelService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
