import { Op } from "sequelize";
import User from "@models/user";

interface IUserRepository {
  save(user: Partial<User>): Promise<User>;
  getAll(
    limit?: number,
    offset?: number,
    searchTerms?: any
  ): Promise<{ rows: User[]; count: number }>;
  getById(id: number): Promise<User | null>;
  delete(id: number): Promise<number>;
  update(user: User): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
}

class UserRepository implements IUserRepository {
  async save(user: Partial<User>): Promise<User> {
    try {
      return await User.create(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(
    limit?: number,
    offset?: number,
    searchTerms?: any
  ): Promise<{ rows: User[]; count: number }> {
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

      return await User.findAndCountAll({
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

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      throw new Error("Error getting user by email");
    }
  }

  async getById(id: number): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw new Error("Error getting user by id");
    }
  }

  async delete(id: number): Promise<number> {
    try {
      return await User.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error("Error deleting user");
    }
  }

  async update(user: User): Promise<User> {
    const { id, name, email } = user;

    try {
      const user = await this.getById(id);
      await user?.update({ name, email });

      return user;
    } catch (error) {
      throw new Error("Error updating user");
    }
  }
}

export default new UserRepository();
