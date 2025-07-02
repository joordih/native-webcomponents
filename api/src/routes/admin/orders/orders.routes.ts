import { Router } from "express";
import OrderController from "@controllers/admin/orders/order.controller";

class OrderRoutes {
  router = Router();
  controller = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/:limit/:offset', this.controller.findAll);
    this.router.get('/', this.controller.findAll);
    this.router.post('/', this.controller.create);
    this.router.delete('/:id', this.controller.delete)
    this.router.put('/', this.controller.update);
    this.router.get('/:id', this.controller.findOne);
  }
}

export default new OrderRoutes().router;