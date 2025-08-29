import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IDocumentation } from './documentation.interface';
import { INestApplication } from '@nestjs/common';

export function initDocumentation(
  app: INestApplication,
  initData: IDocumentation,
) {
  const options2 = {
    customCss: `
      #operations-tag-default {
        display:none !important;
      }
      .swagger-ui .info {
        margin: 5px !important
      }
      .swagger-ui .topbar .download-url-wrapper { display: none }
      .topbar-wrapper img {content:url(\'../assets/images/SwaggerLogo.png\'); width:3000px; height:auto;}
      .swagger-ui .topbar { background-color: #000C1C; }
      `,
    customSiteTitle: 'Cardverse API Docs',
    customfavIcon: 'https://finvault.app/logo.png',
  };
  const options = new DocumentBuilder()
    .setTitle(initData.title)
    .setDescription(initData.description)
    .setVersion(initData.version)
    .addBearerAuth();

  const swaggerOptions = options.build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(initData.endpoint, app, document, options2);
}
