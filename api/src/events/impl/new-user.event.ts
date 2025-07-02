import { IEvents } from "@events/events";
import EmailService from "@services/impl/email.service";
import Redis from "ioredis";

export default class NewUserEvent implements IEvents {
  async handleEvent(redisClient: Redis, subscriberClient: Redis): Promise<void> {
    await subscriberClient.subscribe('new-user', (error) => {
      if (error) {
        console.error(error);
      }
    });

    await subscriberClient.on('message', async (channel, message) => {
      if (channel === 'new-user') {
        const emailService = new EmailService();
        await emailService.sendMail(JSON.parse(message), 'new-user', 'activationUrl', { activationUrl: 'https://joordih.gov:8080/activate' });
      }
    });
  }
}