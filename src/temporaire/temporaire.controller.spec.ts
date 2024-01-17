import { Test, TestingModule } from '@nestjs/testing';
import { TemporaireController } from './temporaire.controller';
import { TemporaireService } from './temporaire.service';

describe('TemporaireController', () => {
  let controller: TemporaireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemporaireController],
      providers: [TemporaireService],
    }).compile();

    controller = module.get<TemporaireController>(TemporaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
