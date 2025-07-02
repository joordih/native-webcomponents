import { Application } from "express";
import { RedisService } from "./impl/redis.service";

export interface IServices {
  initService(): void;
}

export interface ServicesConstructor {
  new(app: Application): IServices;
}

export function executeServices(app: Application) {
  const services: ServicesConstructor[] = [RedisService];
  services.forEach(Service => {
    new Service(app).initService();
  });
}