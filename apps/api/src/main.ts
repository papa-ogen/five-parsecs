import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5555',
    credentials: true,
  });

  const port = process.env.PORT || 9999;
  await app.listen(port);
  
  console.log(`🚀 API is running on: http://localhost:${port}`);
}

bootstrap();
