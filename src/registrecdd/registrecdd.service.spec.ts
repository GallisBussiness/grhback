import { Test, TestingModule } from '@nestjs/testing';
import { RegistrecddService } from './registrecdd.service';

describe('RegistrecddService', () => {
  let service: RegistrecddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrecddService],
    }).compile();

    service = module.get<RegistrecddService>(RegistrecddService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
