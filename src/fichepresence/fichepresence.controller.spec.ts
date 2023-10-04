import { Test, TestingModule } from '@nestjs/testing';
import { FichepresenceController } from './fichepresence.controller';
import { FichepresenceService } from './fichepresence.service';

describe('FichepresenceController', () => {
  let controller: FichepresenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FichepresenceController],
      providers: [FichepresenceService],
    }).compile();

    controller = module.get<FichepresenceController>(FichepresenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
