import { Router } from "express";
import PromoterController from "@controllers/admin/etc/promoter.controller";

class PromoterRoutes {
  router = Router();
  controller = new PromoterController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/stats", this.controller.getStats);
    this.router.get("/:limit/:offset", this.controller.findAll);
    this.router.get("/", this.controller.findAll);
    this.router.post("/", this.controller.create);
    this.router.put("/", this.controller.update);
    this.router.delete("/:id", this.controller.delete);
    this.router.get("/:id", this.controller.findOne);
  }
}

export default new PromoterRoutes().router;
