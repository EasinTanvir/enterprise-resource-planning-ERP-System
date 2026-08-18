import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  const PORT = process.env.PORT;
  await app.listen(PORT ?? 3000, () =>
    console.log(`server running on ${PORT}`),
  );
}
bootstrap();
