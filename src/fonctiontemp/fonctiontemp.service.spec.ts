import { Test, TestingModule } from '@nestjs/testing';
import { FonctiontempService } from './fonctiontemp.service';

describe('FonctiontempService', () => {
  let service: FonctiontempService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FonctiontempService],
    }).compile();

    service = module.get<FonctiontempService>(FonctiontempService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
