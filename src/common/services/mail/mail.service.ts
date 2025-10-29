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

  async notifyNewDemandToAdmin(): Promise<void> {
    const recipient = this.configService.get<string>('BREVO_ADMIN_EMAIL');
    const email = this.createSendSmtpEmail(recipient!, 'BREVO_ADMIN_TEMPLATE_ID');
    await this.sendEmail(email);
  }

  async sendTemplateEmail(recipient: string, name: string): Promise<void> {
    const email = this.createSendSmtpEmail(recipient, 'BREVO_TEMPLATE_ID', { name });
    //console.log(`Sending template email: ${email}`);
    await this.sendEmail(email);
  }

  async notifyValidationToMainGuest(recipient: string, name: string, ulr:string): Promise<void> {
    const email = this.createSendSmtpEmail(recipient, 'BREVO_VALIDATE_TEMPLATE_ID', {'demandLink':ulr, name} );
    await this.sendEmail(email);
  }

  async sendQrTicketsToMainGuest(
    recipientEmail: string,
    name: string,
    guests: { slug: string; firstName: string; lastName: string }[],
  ): Promise<void> {
    const qrContent = this.generateQrHtmlForGuests(guests);

    const email = this.createSendSmtpEmail(recipientEmail, 'BREVO_QR_TEMPLATE_ID', {
      name,
      qrContent,
    });

    await this.sendEmail(email);
  }


  private generateQrHtmlForGuests(guests: { slug: string; firstName: string; lastName: string }[]): string {
    //const baseUrl = this.configService.get<string>('EVENT_GUEST_CHECKIN_BASE_URL') || 'https://events.socialparadise.com/guest';

    return guests
      .map((guest) => {
        //const guestUrl = `${baseUrl}/${guest.slug}`;
        //const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(guestUrl)}&size=400x400`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${guest.slug}&size=400x400`;

        return `
          <div style="margin-bottom: 50px;">
            <p style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">
              ${guest.firstName} ${guest.lastName}
            </p>
            <img src="${qrUrl}" alt="QR Code" style="border: 1px solid #ccc; padding: 5px;" />
            <br />
            <a href="${qrUrl}" download style="display: inline-block; margin-top: 8px; font-size: 13px; color: #1a73e8; text-decoration: underline;">
              Télécharger le QR code
            </a>
          </div>
        `;
      })
      .join('');
  }



}
