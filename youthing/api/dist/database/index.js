"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const database_config_1 = require("@/config/database.config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Database {
    get sequelize() {
        return this._sequelize;
    }
    set sequelize(value) {
        this._sequelize = value;
    }
    async loadModels() {
        const modelsDir = path_1.default.join(__dirname, "../models");
        const models = [];
        const files = fs_1.default.readdirSync(modelsDir);
        for (const file of files) {
            if (file.endsWith(".ts") && !file.endsWith(".test.ts")) {
                const model = require(path_1.default.join(modelsDir, file)).default;
                models.push(model);
            }
        }
        return models;
    }
    async connectDatabase() {
        const models = await this.loadModels();
        this.sequelize = new sequelize_typescript_1.Sequelize({
            database: database_config_1.config.DB,
            username: database_config_1.config.USER,
            password: database_config_1.config.PASSWORD,
            host: database_config_1.config.HOST,
            dialect: database_config_1.dialect,
            pool: {
                max: database_config_1.config.pool.max,
                min: database_config_1.config.pool.min,
                acquire: database_config_1.config.pool.acquire,
                idle: database_config_1.config.pool.idle,
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
exports.default = Database;
//# sourceMappingURL=index.js.map