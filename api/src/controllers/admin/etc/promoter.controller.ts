import { Request, Response, NextFunction } from "express";

import Promoter from "@models/promoter";
import promoterRepository from "@repositories/promoter.repository";

export default class PromoterController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.email) {
      next("Name and email are required");
      return;
    }

    try {
      const promoter = { ...req.body };
      if (!promoter.published) promoter.published = true;

      const savedPromoter: Promoter = await promoterRepository
        .save(promoter)
        .then(async (promoter) => {
          await req.redisClient.publish(
            "new-promoter",
            JSON.stringify(promoter)
          );
          return promoter;
        });

      res.status(201).json(savedPromoter);
    } catch (error) {
      next(error);
    }
  };

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit: number = parseInt(req.params.limit) || 5;
      const offset: number = parseInt(req.params.offset) || 0;
      const searchTerms = {
        name: req.query.name as string,
        email: req.query.email as string,
        status: req.query.status as string,
        role: req.query.role as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
      };

      const promoters = await promoterRepository.getAll(
        limit,
        offset,
        searchTerms
      );

      res.status(200).send(promoters);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid promoter ID" });
    }

    try {
      const promoter = await promoterRepository.getById(id);

      if (promoter) {
        res.status(200).send(promoter);
      } else {
        res.status(404).json({ message: `Promoter not found with id ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id);

    try {
      const deletedNumber = await promoterRepository.delete(id);

      if (deletedNumber == 1) {
        res.status(200).send({ message: "Promoter deleted" });
      } else {
        res.status(404).send({ message: `Promoter not found with id ${id}` });
      }
    } catch (error) {
      next(error);
    }
  };

  async update(req: Request, res: Response, next: NextFunction) {
    const promoter: Promoter = req.body;

    if (!promoter.id) {
      res.status(400).json({ message: "Promoter ID is required" });
    }

    if (!promoter.name || !promoter.email) {
      res.status(400).json({ message: "Name and email are required" });
    }

    try {
      const updatedPromoter = await promoterRepository.update(promoter);
      res.status(200).json(updatedPromoter);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
      }
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await promoterRepository.getStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
