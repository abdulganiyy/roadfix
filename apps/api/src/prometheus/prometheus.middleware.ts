import { Injectable, NestMiddleware } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private httpRequestCounter: Counter<string>;
  private httpRequestDuration: Histogram<string>;

  constructor() {
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP response time in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    });

    register.registerMetric(this.httpRequestCounter);
    register.registerMetric(this.httpRequestDuration);
  }

  use(req: any, res: any, next: () => void) {
    const start = Date.now();

    const httpRequestCounter = this.httpRequestCounter;
    const httpRequestDuration = this.httpRequestDuration;

    res.on('finish', function () {
      const duration = (Date.now() - start) / 1000;

      const route = req.route?.path || req.originalUrl || 'unknown';

      const labels = {
        method: req.method,
        route: route,
        status: res.statusCode,
      };

      httpRequestCounter.inc(labels);
      httpRequestDuration.observe(labels, duration);
    });

    next();
  }
}
