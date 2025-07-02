import { Request, Response, NextFunction } from "express";
import Order from "@models/order";
import orderRepository from "@repositories/order.repository";
import { Redis } from "ioredis";

export default class OrderController {
  async create(req: Request, res: Response, next: NextFunction) {
    if (!req.body.name || !req.body.email) {
      next('Name and email are required');
      return;
    }

    try {
      const order: Order = { ...req.body };
      if (!order.published) order.published = false;

      const savedOrder = await orderRepository.save(order);

      res.status(201).json(savedOrder);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit: number = parseInt(req.params.limit) || 5;
      const offset: number = parseInt(req.params.offset) || 0;
      const searchTerms: string = typeof req.query.search === 'string' ? req.query.search : null;

      const orders = await orderRepository.getAll(limit, offset, searchTerms);

      res.status(200).send(orders);
    } catch (error) {
      next(error)
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const id: number = parseInt(req.params.id);

    try {
      const order = await orderRepository.getById(id);

      if (order) res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id: number = parseInt(req.params.id);

    try {
      const deletedNumber = await orderRepository.delete(id);

      if (deletedNumber == 1) {
        res.status(200).send({ message: 'Order deleted' });
      } else {
        res.status(404).send({ message: `Order not found with id ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    let order: Order = req.body;

    try {
      res.status(200).send(await orderRepository.update(order));
    } catch (error) {
      next(error);
    }
  }
}