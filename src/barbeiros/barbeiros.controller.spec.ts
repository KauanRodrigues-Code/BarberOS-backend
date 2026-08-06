import { Test, TestingModule } from '@nestjs/testing';
import { BarbeirosController } from './barbeiros.controller';

describe('BarbeirosController', () => {
  let controller: BarbeirosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarbeirosController],
    }).compile();

    controller = module.get<BarbeirosController>(BarbeirosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
