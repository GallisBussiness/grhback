import { Test, TestingModule } from '@nestjs/testing';
import { LotscddController } from './lotscdd.controller';
import { LotscddService } from './lotscdd.service';

describe('LotscddController', () => {
  let controller: LotscddController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotscddController],
      providers: [LotscddService],
    }).compile();

    controller = module.get<LotscddController>(LotscddController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
