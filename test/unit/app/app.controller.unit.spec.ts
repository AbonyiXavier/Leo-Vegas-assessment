import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/app.controller';
import { AppService } from '../../../src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "LeoVegas Nodejs Developer API Test 👈👈"', () => {
      expect(appController.getBaseRoute()).toBe(
        'LeoVegas Nodejs Developer API Test 👈👈',
      );
    });
  });
});
