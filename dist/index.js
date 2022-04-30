#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const glob = require("glob");
const config_1 = require("./config");
const uploader_1 = require("./uploader");
const cache_1 = require("./cache");
cache_1.default.loadCache();
process.on("SIGINT", () => {
    cache_1.default.saveCache();
    console.log("Cache saved.");
    process.exit(0);
});
// parse include paths
let paths = [];
config_1.default.include.map((i) => paths.push(...glob.sync(i)));
Promise.all(paths.map(async (p) => {
    let stat = fs.lstatSync(p);
    if (stat.isDirectory()) {
        await uploader_1.default.uploadFolder(p);
    }
    else if (stat.isFile()) {
        await uploader_1.default.uploadFile(p);
    }
})).finally(cache_1.default.saveCache);
