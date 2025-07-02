import { InfoMiddleware } from "./impl/info.middleware";

export class Middleware {
  constructor() {
    new InfoMiddleware();
  }
}