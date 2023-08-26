import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsModelService } from './projects.model.service';

describe('ProjectModelService', () => {
  let service: ProjectsModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsModelService],
    }).compile();

    service = module.get<ProjectsModelService>(ProjectsModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
