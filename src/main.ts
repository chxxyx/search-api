import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 불리언 값 넣을 수 있고 기본값은 false -> 이걸 
    forbidNonWhitelisted: true // 기본 false임, whitelist 걸렸을 때 에러를 낼 수 있음 
  }));
  await app.listen(3000);
}
bootstrap();
