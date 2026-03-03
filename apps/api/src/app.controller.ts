import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Controller()
export class AppController {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly counter: Counter<string>,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    this.counter.inc({ method: 'GET' }); // Increment the counter with a label
    return this.appService.getHello();
  }
}
