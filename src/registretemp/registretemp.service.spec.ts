import { Test, TestingModule } from '@nestjs/testing';
import { RegistretempService } from './registretemp.service';

describe('RegistretempService', () => {
  let service: RegistretempService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistretempService],
    }).compile();

    service = module.get<RegistretempService>(RegistretempService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
