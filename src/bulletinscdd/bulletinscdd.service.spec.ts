import { Test, TestingModule } from '@nestjs/testing';
import { BulletinscddService } from './bulletinscdd.service';

describe('BulletinscddService', () => {
  let service: BulletinscddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulletinscddService],
    }).compile();

    service = module.get<BulletinscddService>(BulletinscddService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
