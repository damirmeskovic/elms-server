import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TagDto } from './controllers/types/tag.dto';
import { AuthorDto } from './controllers/types/author.dto';
import { BookDto } from './controllers/types/book.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Elms')
    .setDescription('Elms API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [BookDto, TagDto, AuthorDto],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(8888);
}
bootstrap();
