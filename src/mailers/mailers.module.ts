import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerProvider } from './mailer.provider';

@Module({
  imports: [ConfigModule, MailerModule.forRootAsync(MailerProvider)],
  providers: [],
  exports: [MailerModule],
})
export class MailersModule {}
