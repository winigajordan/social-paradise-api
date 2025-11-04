import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {cors: true});
  //Pour les validations des Dto
  app.useGlobalPipes(new ValidationPipe(
    {transform: true}
  ));

  // Déclaration des Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  //Déclaration des filters
  app.useGlobalFilters(new HttpExceptionFilter());

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Nom de ton API')
    .setDescription('La description de ton API')
    .setVersion('1.0')
    .addBearerAuth()// si tu utilises JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
