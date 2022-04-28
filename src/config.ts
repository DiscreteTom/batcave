import * as yaml from "js-yaml";
import * as fs from "fs";
import * as os from "os";

type Config = {
  storage: {
    bucket: string;
    prefix: string;
    queueSize: number;
    partSize: number;
    tagKey: string;
  };
  include: string[];
  exclude: string[];
  excludeFolderContains: string[];
  gitignore: boolean;
};

let config = yaml.load(fs.readFileSync("config.yml", "utf-8")) as Config;
let home = os.homedir().replaceAll("\\", "/");
config.include = config.include.map((i) =>
  i.startsWith("~") ? home + i.slice(1) : i
);

export default config;
