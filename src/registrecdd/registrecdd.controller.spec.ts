import { Test, TestingModule } from '@nestjs/testing';
import { RegistrecddController } from './registrecdd.controller';
import { RegistrecddService } from './registrecdd.service';

describe('RegistrecddController', () => {
  let controller: RegistrecddController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrecddController],
      providers: [RegistrecddService],
    }).compile();

    controller = module.get<RegistrecddController>(RegistrecddController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
