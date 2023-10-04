import { Test, TestingModule } from '@nestjs/testing';
import { FichepresenceService } from './fichepresence.service';

describe('FichepresenceService', () => {
  let service: FichepresenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FichepresenceService],
    }).compile();

    service = module.get<FichepresenceService>(FichepresenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
