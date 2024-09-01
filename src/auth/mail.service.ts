import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';

@Injectable()
export class MailService {
  private mg;

  constructor() {
    this.mg = mailgun({
      apiKey: '44c05d29c81a92ee15c1a0f291030a05-777a617d-dd1d36d9', 
      domain: 'sandbox187a546a0e9c4e94afcb4124221e03bc.mailgun.org',
    }); 
  }
 
  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationLink = `http://your-domain.com/auth/verify?token=${token}`;
    
    const data = {
      from: 'noreply@sandbox187a546a0e9c4e94afcb4124221e03bc.mailgun.org',
      to,
      subject: 'Verify your email',
      text: `Please verify your email by clicking the following link: ${verificationLink}`,
      html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
    };

    try {
      await this.mg.messages().send(data);
    } catch (error) {
      console.error('Error sending email:', error.message);
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}
