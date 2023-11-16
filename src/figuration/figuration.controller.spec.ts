import { Test, TestingModule } from '@nestjs/testing';
import { FigurationController } from './figuration.controller';
import { FigurationService } from './figuration.service';

describe('FigurationController', () => {
  let controller: FigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FigurationController],
      providers: [FigurationService],
    }).compile();

    controller = module.get<FigurationController>(FigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
