import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { exceptionFactory } from './validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory,
    }),
  );

  app.setGlobalPrefix('/api/v1');

  const port = app.get(ConfigService).get<number>('PORT');

  await app.listen(port as number, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}`);
  });
}
bootstrap();
