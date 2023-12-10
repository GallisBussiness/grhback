import { Test, TestingModule } from '@nestjs/testing';
import { RegistreService } from './registre.service';

describe('RegistreService', () => {
  let service: RegistreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistreService],
    }).compile();

    service = module.get<RegistreService>(RegistreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
