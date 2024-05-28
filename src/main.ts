import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(json({limit: '60mb'}));

  app.enableCors( {
    allowedHeaders:'*',
    origin:'*',
    credentials: true,
  });

  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Example mongo')
  .setDescription('Api course docummentation')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
