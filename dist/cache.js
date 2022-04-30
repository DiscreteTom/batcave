"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("js-yaml");
let cache = {};
const filename = ".cache.yml";
exports.default = {
    loadCache() {
        try {
            cache = yaml.load(fs.readFileSync(filename, "utf-8"));
        }
        catch {
            cache = {};
        }
    },
    saveCache() {
        fs.writeFileSync(filename, yaml.dump(cache), "utf-8");
    },
    get(key) {
        return cache[key];
    },
    set(key, value) {
        cache[key] = value;
    },
};
