import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  create(@Body() body: { name: string; otp: string; to: string }) {
    return this.mailService.sendEmailOtp({
      name: body.name,
      otp: body.otp,
      to: body.to,
    });
  }
}
