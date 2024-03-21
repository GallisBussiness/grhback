import { Test, TestingModule } from '@nestjs/testing';
import { LotstempService } from './lotstemp.service';

describe('LotstempService', () => {
  let service: LotstempService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotstempService],
    }).compile();

    service = module.get<LotstempService>(LotstempService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
