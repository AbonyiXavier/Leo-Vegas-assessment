import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getBaseRoute(): string {
    return 'LeoVegas Nodejs Developer API Test 👈👈';
  }
}
