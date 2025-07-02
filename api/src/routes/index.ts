import { Application } from "express";

import authRouter from "./auth/router.routes";
import adminRouter from "./admin/router.routes";
import landingRouter from "./landing/router.routes";

import ordersRoutes from "./admin/orders/orders.routes";
import usersRoute from "./admin/users/users.route";
import { Middleware } from "src/middleware/middlewares";

export default class Route {
  constructor(app: Application) {
    new Middleware();
    
    app.use('/api/auth/routes', authRouter);
    app.use('/api/admin/routes', adminRouter);
    app.use('/api/landing/routes', landingRouter);

    app.use('/api/admin/orders', ordersRoutes);
    app.use('/api/admin/users', usersRoute);

    app.use((err, req, res, next) => {
      if (err instanceof TypeError && err.message.includes('circular structure')) {
        console.error('Error de serialización:', err);
        return res.status(500).json({
          error: 'Error interno del servidor',
          message: 'No se pudo procesar la respuesta'
        });
      }
      next(err);
    });
  }
}