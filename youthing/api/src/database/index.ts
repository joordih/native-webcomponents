import { Sequelize } from "sequelize-typescript";
import { config, dialect } from "@/config/database.config";
import fs from "fs";
import path from "path";

class Database {
  private _sequelize: Sequelize | undefined;

  public get sequelize(): Sequelize | undefined {
    return this._sequelize;
  }
  public set sequelize(value: Sequelize | undefined) {
    this._sequelize = value;
  }

  private async loadModels(): Promise<any[]> {
    const modelsDir = path.join(__dirname, "../models/impl");
    const models: any[] = [];

    const files = fs.readdirSync(modelsDir);

    for (const file of files) {
      if (file.endsWith(".ts") && !file.endsWith(".test.ts")) {
        const model = require(path.join(modelsDir, file)).default;
        console.log("Model:", JSON.stringify(model));
        models.push(model);
      }
    }

    return models;
  }

  public async connectDatabase() {
    const models = await this.loadModels();

    this.sequelize = new Sequelize({
      database: config.DB,
      username: config.USER,
      password: config.PASSWORD,
      host: config.HOST,
      dialect: dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
      },
      models,
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((error) => {
        console.error("Unable to connect to the database:", error);
      });

    if (process.env.NODE_ENV === "development") {
      await this.sequelize.sync({ alter: true });
      console.log("Successfully models sync.");
    }
  }
}

export default Database;
