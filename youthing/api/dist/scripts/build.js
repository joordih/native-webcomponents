"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
console.log("Compilando TypeScript...");
(0, child_process_1.execSync)("tsc", { stdio: "inherit" });
console.log("Copiando archivos de configuración...");
(0, child_process_1.execSync)("cp -r config dist/", { stdio: "inherit" });
console.log("¡Compilación completada!");
//# sourceMappingURL=build.js.map