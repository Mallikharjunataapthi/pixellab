import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // const reflector = app.get( Reflector );
  // app.useGlobalGuards( new AuthGuard( reflector ) );

  const config = new DocumentBuilder()
    .setTitle('Pixel Lab')
    .setDescription('The Pixel Lab API description')
    .setVersion('1.0')
    .addServer('http://localhost:3100/', 'Local environment')
    .addServer('https://pixellab.onrender.com/', 'Staging')
    .addServer('http://164.52.195.167:3100/', 'Production')
    .addTag('Pixel Lab')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(3100);
}
bootstrap();
