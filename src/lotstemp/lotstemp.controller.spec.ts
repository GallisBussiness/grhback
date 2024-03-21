import { Test, TestingModule } from '@nestjs/testing';
import { LotstempController } from './lotstemp.controller';
import { LotstempService } from './lotstemp.service';

describe('LotstempController', () => {
  let controller: LotstempController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotstempController],
      providers: [LotstempService],
    }).compile();

    controller = module.get<LotstempController>(LotstempController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
