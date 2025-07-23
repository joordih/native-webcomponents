import { execSync } from "child_process";

console.log("Compilando TypeScript...");
execSync("tsc", { stdio: "inherit" });

console.log("Copiando archivos de configuración...");
execSync("cp -r config dist/", { stdio: "inherit" });

console.log("¡Compilación completada!");
