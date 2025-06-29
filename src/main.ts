import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import helmet from 'helmet';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: `http://localhost:${PORT}`,
    credentials: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Hire Smart API')
      .setDescription('This api will help clients to store their data.')
      .setVersion('1.0')
      .addTag('Hire Smart')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      })
      .addSecurity('X-CSRF-TOKEN', {
        type: 'apiKey',
        in: 'header',
        name: 'x-csrf-token',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);
  }

  app.use(cookieParser());

  // CSRF protection
  app.use(csurf({ cookie: true }));

  // Sanitize inputs
  app.use(helmet());

  await app.listen(PORT);
}
bootstrap();
