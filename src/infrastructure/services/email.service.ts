import nodemailer from 'nodemailer';
import {
  IEmailService,
  SendEmailOptions,
} from '../../application/interfaces/services/email.service.interface';
import { config } from '../../config/env.config';
import { injectable } from 'tsyringe';
@injectable()
export class EmailService implements IEmailService {
  private _transporter;
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: Number(config.smtp.port),
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    await this._transporter.sendMail({
      from: config.smtp.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }

  async sendOtp(email: string, code: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>

          <p>Your OTP code is:</p>

          <h1 style="letter-spacing: 5px;">
            ${code}
          </h1>

          <p>This OTP expires in 10 minutes.</p>
        </div>
      `,
    });
  }
}
