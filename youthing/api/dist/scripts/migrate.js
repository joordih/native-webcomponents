"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const command = process.argv[2] || "up";
try {
    (0, child_process_1.execSync)(`npm run build`, { stdio: "inherit" });
    (0, child_process_1.execSync)(`npx sequelize-cli db:migrate${command === "down" ? ":undo" : ""}`, {
        stdio: "inherit",
    });
}
catch (error) {
    console.error("Error ejecutando migraciones:", error);
    process.exit(1);
}
//# sourceMappingURL=migrate.js.map