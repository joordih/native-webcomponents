import { Request, Response, NextFunction } from "express";

export default class RouterController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const routes = {
        "/login": "login",
        "/register": "register",
        "/swapy": "swapy",
        "/builder": "builder",
      };

      res.status(200).send(routes);
    } catch (error) {
      next(error);
    }
  }
}
