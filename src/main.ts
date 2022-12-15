import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaFilter } from './prisma.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new PrismaFilter());

  const config = new DocumentBuilder()
    .setTitle('Audio track company')
    .setDescription('The audio track API')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        name: 'Authorization',
        scheme: 'bearer',
        bearerFormat: 'Bearer',
        description:
          'Here pass the bearer token got from the login/register option',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
