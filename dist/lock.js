"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
let concurrent = 0;
exports.default = {
    async lock(f) {
        while (concurrent >= config_1.default.concurrent.limit) {
            // sleep
            await new Promise((resolve) => setTimeout(resolve, config_1.default.concurrent.interval));
        }
        concurrent++;
        await f();
        concurrent--;
    },
};
