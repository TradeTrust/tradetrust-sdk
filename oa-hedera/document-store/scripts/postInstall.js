const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const truffle = path.join(process.cwd(), "node_modules", ".bin", "truffle");
if (fs.existsSync(truffle) && process.env.npm_config_production !== "true") {
  console.log("Running truffle build");
  execSync("npm run build:sol");
} else {
  console.log("Not running truffle");
}
