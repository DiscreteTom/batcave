import { program } from "commander";

program.argument("[config]", "Config file.", "config.yml");

program.parse();

export const args = program.args;
export const opts = program.opts();
