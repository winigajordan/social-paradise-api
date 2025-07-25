import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {

  private readonly brevoClient: SibApiV3Sdk.TransactionalEmailsApi;



  constructor(
    private readonly configService: ConfigService
  ) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = this.configService.get<string>('BREVO_API_KEY') ;

    this.brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  private createSendSmtpEmail(
    recipientEmail: string,
    templateIdEnvKey: string,
    params?: Record<string, any>
  ): SibApiV3Sdk.SendSmtpEmail {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: recipientEmail }];
    sendSmtpEmail.sender = {
      name: 'SOCIAL PARADISE',
      email: this.configService.get<string>('BREVO_SENDER_EMAIL'),
    };
    sendSmtpEmail.templateId = parseInt(this.configService.get<string>(templateIdEnvKey) || '0');

    if (params) {
      sendSmtpEmail.params = params;
    }

    return sendSmtpEmail;
  }

  private async sendEmail(sendSmtpEmail: SibApiV3Sdk.SendSmtpEmail): Promise<void> {
    try {
      await this.brevoClient.sendTransacEmail(sendSmtpEmail);
    } catch (err) {
      console.error('Erreur lors de l’envoi de l’email Brevo :', err);
      throw err;
    }
  }

  async toAdmin(): Promise<void> {
    const recipient = this.configService.get<string>('BREVO_ADMIN_EMAIL');
    const email = this.createSendSmtpEmail(recipient!, 'BREVO_ADMIN_TEMPLATE_ID');
    await this.sendEmail(email);
  }

  async sendTemplateEmail(recipient: string, name: string): Promise<void> {
    const email = this.createSendSmtpEmail(recipient, 'BREVO_TEMPLATE_ID', { name });
    await this.sendEmail(email);
  }

}
