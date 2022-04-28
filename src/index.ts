import * as yaml from "js-yaml";
import * as fs from "fs";
import * as glob from "glob";
import * as os from "os";

type Config = {
  storage: {
    bucket: string;
    prefix: string;
  };
  include: string[];
  exclude: string[];
  gitignore: boolean;
};

let config = yaml.load(fs.readFileSync("config.yml", "utf-8")) as Config;
let home = os.homedir().replaceAll("\\", "/");
config.include = config.include.map((i) =>
  i.startsWith("~") ? home + i.slice(1) : i
);

// parse target files
let files: string[] = [];
config.include.map((i) => {
  files.push(...glob.sync(i));
});

console.log(files);
