import { Application, Request, Response, NextFunction } from 'express';
import { IServices } from '@services/services';
import { executeEvents } from '@events/events';

import session from 'express-session';
import RedisStore from 'connect-redis';
import IORedis from 'ioredis';
import NewUserEvent from '@events/impl/new-user.event';

export class RedisService implements IServices {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  initService() {
    const redisClient = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379')

    const subscriberClient = new IORedis(process.env.REDIS_URL);
    const redisStore = new RedisStore({ client: redisClient, prefix: 'api:' });

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.redisClient = redisClient;
      next();
    });

    executeEvents([NewUserEvent], redisClient, subscriberClient);

    this.app.use(session({
      store: redisStore,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        domain: new URL(process.env.APP_URL || 'http://localhost:8080').hostname,
        maxAge: 24 * 60 * 60 * 1000
      }
    }));
  }
}