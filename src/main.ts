import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 불리언 값 넣을 수 있고 기본값은 false -> 이걸 
    forbidNonWhitelisted: true // 기본 false임, whitelist 걸렸을 때 에러를 낼 수 있음 
  }));
  // Swagger 설정
  const config = new DocumentBuilder()
  .setTitle('SEARCH API')
  .setDescription('Search API description')
  .setVersion('1.0')
  .addTag('ecf-api-task')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  // '/api' 경로로 Swagger UI 접근 가능
  await app.listen(3000);
}
bootstrap();
