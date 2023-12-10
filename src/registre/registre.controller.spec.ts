import { Test, TestingModule } from '@nestjs/testing';
import { RegistreController } from './registre.controller';
import { RegistreService } from './registre.service';

describe('RegistreController', () => {
  let controller: RegistreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistreController],
      providers: [RegistreService],
    }).compile();

    controller = module.get<RegistreController>(RegistreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
