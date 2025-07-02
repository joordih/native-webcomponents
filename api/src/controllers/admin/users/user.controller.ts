import { Request, Response, NextFunction } from 'express';

import User from '@models/user';
import userRepository from '@repositories/user.repository';

export default class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    if (!req.body.name || !req.body.email) {
      next('Name and email are required');
      return;
    }

    try {
      const user = { ...req.body };
      if (!user.published) user.published = false;

      const savedUser: User = await userRepository.save(user).then(async (user) => {
        await req.redisClient.publish('new-user', JSON.stringify(user));
        return user;
      });

      res.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  }

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
        dateTo: req.query.dateTo as string
      };

      const users = await userRepository.getAll(limit, offset, searchTerms);

      res.status(200).send(users);
    } catch (error) {
      next(error)
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const id: number = parseInt(req.params.id);

    try {
      const user = await userRepository.getById(id);

      if (user) res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id: number = parseInt(req.params.id);

    try {
      const deletedNumber = await userRepository.delete(id);

      if (deletedNumber == 1) {
        res.status(200).send({ message: 'User deleted' });
      } else {
        res.status(404).send({ message: `User not found with id ${id}` });
      }
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    let user: User = req.body;

    try {
      res.status(200).send(await userRepository.update(user));
    } catch (error) {
      next(error);
    }
  }
}