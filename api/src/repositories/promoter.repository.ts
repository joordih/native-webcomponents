import { Op } from "sequelize";
import Promoter from "@models/promoter";

interface IPromoterRepository {
  save(promoter: Partial<Promoter>): Promise<Promoter>;
  getAll(
    limit?: number,
    offset?: number,
    searchTerms?: any
  ): Promise<{ rows: Promoter[]; count: number }>;
  getById(id: number): Promise<Promoter | null>;
  delete(id: number): Promise<number>;
  update(promoter: Promoter): Promise<Promoter>;
  getUserByEmail(email: string): Promise<Promoter | null>;
  getStats(): Promise<any>;
}

class PromoterRepository implements IPromoterRepository {
  async save(promoter: Partial<Promoter>): Promise<Promoter> {
    try {
      return await Promoter.create(promoter);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(
    limit?: number,
    offset?: number,
    searchTerms?: any
  ): Promise<{ rows: Promoter[]; count: number }> {
    try {
      const filters = { where: { published: true }, having: {} };

      if (searchTerms) {
        const { name, email, status, role, dateFrom, dateTo } = searchTerms;

        if (name) {
          filters.where[Op.or] = filters.where[Op.or] || [];
          filters.where[Op.or].push({ name: { [Op.like]: `%${name}%` } });
        }

        if (email) {
          filters.where[Op.or] = filters.where[Op.or] || [];
          filters.where[Op.or].push({ email: { [Op.like]: `%${email}%` } });
        }

        if (status) {
          filters.where["status"] = status;
        }

        if (role) {
          filters.where["role"] = role;
        }

        if (dateFrom && dateTo) {
          filters.where["createdAt"] = {
            [Op.between]: [new Date(dateFrom), new Date(dateTo)],
          };
        } else if (dateFrom) {
          filters.where["createdAt"] = {
            [Op.gte]: new Date(dateFrom),
          };
        } else if (dateTo) {
          filters.where["createdAt"] = {
            [Op.lte]: new Date(dateTo),
          };
        }
      }

      return await Promoter.findAndCountAll({
        where: filters.where,
        limit: limit,
        offset: offset,
        attributes: ["id", "name", "email", "createdAt", "updatedAt"],
        paranoid: true,
      });
    } catch (error) {
      throw new Error("Error getting users");
    }
  }

  async getUserByEmail(email: string): Promise<Promoter | null> {
    try {
      return await Promoter.findOne({ where: { email } });
    } catch (error) {
      throw new Error("Error getting promoter by email");
    }
  }

  async getById(id: number): Promise<Promoter | null> {
    try {
      return await Promoter.findByPk(id);
    } catch (error) {
      throw new Error("Error getting promoter by id");
    }
  }

  async delete(id: number): Promise<number> {
    try {
      return await Promoter.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error("Error deleting promoter");
    }
  }

  async update(promoter: Promoter): Promise<Promoter> {
    const { id, name, email, status, role, published } = promoter;

    try {
      const existingPromoter = await this.getById(id);
      if (!existingPromoter) {
        throw new Error(`Promoter with id ${id} not found`);
      }

      await existingPromoter.update({
        name,
        email,
        status,
        role,
        published,
      });

      return existingPromoter;
    } catch (error) {
      throw new Error("Error updating promoter");
    }
  }

  async getStats(): Promise<any> {
    try {
      const total = await Promoter.count({ where: { published: true } });
      const active = await Promoter.count({
        where: { published: true, status: "active" },
      });
      const pending = await Promoter.count({
        where: { published: true, status: "pending" },
      });

      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const newThisMonth = await Promoter.count({
        where: {
          published: true,
          createdAt: {
            [Op.gte]: firstDayOfMonth,
          },
        },
      });

      return {
        total,
        active,
        pending,
        newThisMonth,
      };
    } catch (error) {
      throw new Error("Error getting promoter stats");
    }
  }
}

export default new PromoterRepository();
