import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TemplateService } from './template.service';
import { BrevoProvider } from './brevo.provider';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService, TemplateService, BrevoProvider],
  exports: [MailService],
})
export class MailModule {}
