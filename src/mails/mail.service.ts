import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface MailObject<T> {
  to: string | Array<string>;
  subject: string;
  template: string;
  context?: T;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async mail<T>(instance: MailObject<T>): Promise<void> {
    await this.mailerService.sendMail({
      to: instance.to,
      subject: instance.subject,
      template: instance.template,
      context: instance.context,
    });
  }
}
