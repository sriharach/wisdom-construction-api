import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { LoggingInterceptor } from './helper/logging.interceptor';
import { TransformInterceptor } from './helper/transform.interceptor';
import { GlobalExceptionFilter } from './helper/errors.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';

export async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
      credentials: true, // If using cookies or authorization headers
    },
  });
  app.use(
    helmet({
      referrerPolicy: { policy: 'strict-origin' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe()); // ✅ ใช้ global validation pipe
  // serve-static
  app.useStaticAssets(path.join(process.cwd(), 'src', 'uploads-all'));
  app.setGlobalPrefix('api');
  return app;
}

async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT ?? 3000);
}

if (require.main === module) {
  bootstrap();
}
