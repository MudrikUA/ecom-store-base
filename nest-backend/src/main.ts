import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // console.log(`CORS Rule: ${process.env.CORS_RULE}`);
  app.enableCors({
    origin: [process.env.CORS_RULE?.split(',')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use('/static', express.static(path.join(__dirname, '..', 'static')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
