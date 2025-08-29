import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailersModule } from '../mailers/mailers.module';

@Module({
  imports: [MailersModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
