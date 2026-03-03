import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';
import { BrevoProvider } from './brevo.provider';

@Injectable()
export class MailService {
  constructor(
    private templateService: TemplateService,
    private brevo: BrevoProvider,
  ) {}

  async sendMail(options: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }) {
    const html = this.templateService.render(options.template, options.context);

    await this.brevo.sendEmail({
      to: options.to,
      subject: options.subject,
      html,
      from: process.env.MAIL_FROM!,
    });
  }

  async sendEmailOtp({
    name,
    to,
    otp,
  }: {
    name: string;
    to: string;
    otp: string;
  }) {
    await this.sendMail({
      to,
      subject: 'Welcome to Ile Iyan! Confirm your Email',
      template: 'verify-email', // `.hbs` extension is appended automatically
      context: {
        otp,
        name,
      },
    });

    console.log(`OTP for ${to}: ${otp}`);
  }

  async sendPasswordReset(data: { to: string; resetLink: string }) {}
}
