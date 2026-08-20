import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const PORT = process.env.PORT;
  await app.listen(PORT ?? 3000, () =>
    console.log(`server running on ${PORT}`),
  );
}
void bootstrap();
