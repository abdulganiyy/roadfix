import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MetricsMiddleware } from './prometheus/prometheus.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(new MetricsMiddleware().use);

  await app.listen(process.env.PORT ?? 3200);
}
bootstrap();
