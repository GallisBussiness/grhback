import { Test, TestingModule } from '@nestjs/testing';
import { BulletinscddController } from './bulletinscdd.controller';
import { BulletinscddService } from './bulletinscdd.service';

describe('BulletinscddController', () => {
  let controller: BulletinscddController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulletinscddController],
      providers: [BulletinscddService],
    }).compile();

    controller = module.get<BulletinscddController>(BulletinscddController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
