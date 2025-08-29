import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

export const MailerProvider = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const _transport = {
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      auth: {
        user: configService.get('MAIL_USERNAME'),
        pass: configService.get('MAIL_PASSWORD'),
      },
      secureConnection: configService.get('MAIL_TLS') || false,
    };
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'emailTemplates',
    );
    return {
      transport: _transport,
      defaults: {
        from: `"${configService.get('MAIL_USER')}" ${configService.get(
          'MAIL_FROM',
        )}`,
      },
      template: {
        dir: templatePath,
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  },
};
