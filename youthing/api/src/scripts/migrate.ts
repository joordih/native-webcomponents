import { execSync } from "child_process";

const command = process.argv[2] || "up";

try {
  execSync(`npm run build`, { stdio: "inherit" });
  execSync(`npx sequelize-cli db:migrate${command === "down" ? ":undo" : ""}`, {
    stdio: "inherit",
  });
} catch (error) {
  console.error("Error ejecutando migraciones:", error);
  process.exit(1);
}
