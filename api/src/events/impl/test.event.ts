import { IEvents } from '../events';
import IORedis from 'ioredis';

export default class TestEvent implements IEvents {
  async handleEvent(redisClient: IORedis, subscriberClient: IORedis): Promise<void> {
    subscriberClient.subscribe('test', (error) => {
      if (error) {
        console.error(error);
      }
    });

    subscriberClient.on('message', (channel, message) => {
      if (channel === 'test') {
      }
    });
  }
}