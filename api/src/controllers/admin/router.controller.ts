import { Request, Response, NextFunction } from "express";

export default class RouterController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const routes = {
        "/orders": "orders",
        "/users": "users",
        "/promoters": "promoters",
      };

      res.status(200).send(routes);
    } catch (error) {
      next(error);
    }
  }
}
