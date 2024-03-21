import { Test, TestingModule } from '@nestjs/testing';
import { RegistretempController } from './registretemp.controller';
import { RegistretempService } from './registretemp.service';

describe('RegistretempController', () => {
  let controller: RegistretempController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistretempController],
      providers: [RegistretempService],
    }).compile();

    controller = module.get<RegistretempController>(RegistretempController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
