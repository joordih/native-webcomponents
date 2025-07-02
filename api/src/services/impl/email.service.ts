import { IServices } from "@services/services";
import { google } from 'googleapis';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import SentEmail from "@models/sentMail";
import EmailError from "@models/emailError";
import path from "path";

export default class EmailService implements IServices {
  private oAuth2;

  public email;
  public transport;
  public template;

  constructor() {
    this.oAuth2 = google.auth.OAuth2;
    this.initService();
  }

  initService() {
    this.email = process.env.GOOGLE_EMAIL;

    this.transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: this.getAccessToken(),
      }
    });

    this.template = {
      activationUrl: { file: 'activation-url', subject: { es: 'Activación de cuenta', en: 'Account activation' } },
      orderDetails: { file: 'order-details', subject: { es: 'Detalles de la orden', en: 'Order details' } },
    };
  }

  getAccessToken() {
    const myOAuth2Clkient = new this.oAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    myOAuth2Clkient.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const myAccessToken = myOAuth2Clkient.getAccessToken();

    return myAccessToken;
  }

  async sendMail(user, userType, template, data, attachments = []) {
    try {
      const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      data.apiUrl = process.env.APP_URL || 'http://localhost:8080';
      data.uuid = uuid;

      ejs.renderFile(path.join(__dirname, `../../templates/emails/es/${this.template[template].file}.ejs`), { data }, (err, html) => {
        if (err) {
          EmailError.create({
            userId: user.id,
            userType,
            emailTemplate: template,
            error: err.message,
          });

          return
        }

        const mailOptions: nodemailer.SendMailOptions = {
          from: this.email,
          to: user.email,
          subject: this.template[template].subject['es'],
          html
        }

        if (attachments.length) {
          mailOptions.attachments = attachments;
        }

        this.transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            EmailError.create({
              userId: user.id,
              userType,
              emailTemplate: template,
              error: error.message,
            });
          } else {
            SentEmail.create({
              userId: user.id,
              userType,
              sendAt: new Date(),
              emailTemplate: template,
              readed: false,
              uuid
            });
          }
        });
      })
    } catch (error) {
      console.log(error);
    }
  }

  emailReaded(uuid) {
    SentEmail.update({ readed: true }, { where: { uuid } });
  }
}