import { NestFactory, Reflector } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { initDocumentation } from './documentation';
import { AppModule } from './app.module';
import CustomExceptionsFilter from './exceptions-filter/exceptions-filter';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { EncryptionInterceptor, ValidationPipe } from './common';
import { EncryptionService } from './shared/encryption/encryption.service';

async function bootstrap() {
  const options = {
    cors: true,
  };

  if (process.env.ENABLE_SSL == '1') {
    options['httpsOptions'] = {
      key: readFileSync(__dirname + '/certs/privkey.pem'),
      cert: readFileSync(__dirname + '/certs/cert.pem'),
    };
  }
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    options,
  );

  const configService = app.get(ConfigService);
  app.enableCors({
    // convert all the CORS strings into regexp
    origin: configService
      .get('URL_REFERERS')
      .split(',')
      .map(function (item) {
        return new RegExp(item);
      }),
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix(configService.get('PREFIX'));

  if (configService.get('ENABLE_SWAGGER') === '1') {
    initDocumentation(app, {
      version: '1.0',
      title: 'Cardverse Service',
      description: 'Cardverse Rest APIs',
      endpoint: '/docs',
    });
  }
  const httpAdapter = app.getHttpAdapter();
  const logger = app.get(LoggerService);
  app.useGlobalFilters(
    new CustomExceptionsFilter(httpAdapter.getHttpServer(), logger),
  );
  app.useStaticAssets(join(__dirname, '..', 'assets'), { prefix: '/assets' });

  app.useGlobalInterceptors(
    new EncryptionInterceptor(
      app.get(EncryptionService),
      app.get(ConfigService),
      app.get(Reflector),
    ),
  );

  const port = configService.get('PORT') || configService.get('APP_PORT');
  await app.listen(port);
  process.env.ENABLE_SSL == '1'
    ? console.log(`App listening on the HTTPS port ${port}`)
    : console.log(` App listening on the HTTP port ${port}`);
}
bootstrap();
