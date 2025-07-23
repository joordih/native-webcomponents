"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = exports.config = void 0;
exports.config = {
    HOST: '127.0.0.1',
    USER: 'root',
    PASSWORD: 'password',
    DB: 'orders_2',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
exports.dialect = 'mysql';
//# sourceMappingURL=database.config.js.map