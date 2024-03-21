import { Test, TestingModule } from '@nestjs/testing';
import { LotscddService } from './lotscdd.service';

describe('LotscddService', () => {
  let service: LotscddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotscddService],
    }).compile();

    service = module.get<LotscddService>(LotscddService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
