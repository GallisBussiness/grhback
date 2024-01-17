import { Test, TestingModule } from '@nestjs/testing';
import { TemporaireService } from './temporaire.service';

describe('TemporaireService', () => {
  let service: TemporaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemporaireService],
    }).compile();

    service = module.get<TemporaireService>(TemporaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
