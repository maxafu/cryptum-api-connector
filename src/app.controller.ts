import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health/alive')
  getHealthAlive() {
    return { status: 200 };
  }
  @Get('/health/ready')
  getHealthReady() {
    return { status: 200 };
  }
}
