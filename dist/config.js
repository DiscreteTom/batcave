"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require("js-yaml");
const fs = require("fs");
const os = require("os");
const chalk = require("chalk");
function must(condition, errMsg) {
    if (!condition)
        console.log(chalk.red(errMsg));
}
const filename = process.argv.length > 2 ? process.argv[2] : "config.yml";
let config = yaml.load(fs.readFileSync(filename, "utf-8"));
must(config.storage.bucket, "Missing bucket name");
config.storage.prefix ||= "";
config.storage.queueSize ||= 4;
config.storage.partSize ||= 5;
config.storage.profile ||= "default";
must(config.storage.region, "Missing bucket region");
config.concurrent.limit ||= 100;
config.concurrent.interval ||= 2000;
// replace home dir in 'config.include'
let home = os.homedir().replaceAll("\\", "/");
config.include = config.include.map((i) => i.startsWith("~") ? home + i.slice(1) : i);
exports.default = config;
