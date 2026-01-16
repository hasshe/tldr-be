import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const raw = process.env.ALLOWED_ORIGINS ?? '';
  const allowed = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  console.log('Allowed CORS origins:', allowed);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      console.log('CORS request from origin:', origin);

      // Allow requests with no origin
      if (!origin) return callback(null, true);

      // Allow any Chrome extension
      if (origin.startsWith('chrome-extension://')) return callback(null, true);

      // Allow any browser extension (Firefox, Edge, etc.)
      if (origin.startsWith('moz-extension://')) return callback(null, true);
      if (origin.startsWith('safari-extension://')) return callback(null, true);
      if (origin.startsWith('extension://')) return callback(null, true);

      // Check against allowed origins list
      if (allowed.includes(origin)) return callback(null, true);

      console.error(`CORS BLOCKED - Origin "${origin}" not in allowed list`);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
