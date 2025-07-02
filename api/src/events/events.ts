import IORedis from 'ioredis';

export interface IEvents {
  handleEvent(redisClient: IORedis, subscriberClient: IORedis): Promise<void>;
}

export interface EventsConstructor {
  new(): IEvents;
}

export function executeEvents(events: EventsConstructor[], redisClient: IORedis, subscriberClient: IORedis) {
  events.forEach(Event => {
    new Event().handleEvent(redisClient, subscriberClient);
  });
}