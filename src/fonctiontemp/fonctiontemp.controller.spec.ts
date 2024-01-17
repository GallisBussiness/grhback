import { Test, TestingModule } from '@nestjs/testing';
import { FonctiontempController } from './fonctiontemp.controller';
import { FonctiontempService } from './fonctiontemp.service';

describe('FonctiontempController', () => {
  let controller: FonctiontempController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FonctiontempController],
      providers: [FonctiontempService],
    }).compile();

    controller = module.get<FonctiontempController>(FonctiontempController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
