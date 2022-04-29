import * as yaml from "js-yaml";
import * as fs from "fs";
import * as os from "os";
import * as chalk from "chalk";

type Config = {
  storage: {
    bucket: string;
    prefix: string;
    queueSize: number;
    partSize: number;
    profile: string;
    region: string;
  };
  include: string[];
  exclude: string[];
  excludeFolderContains: string[];
  concurrent: {
    limit: number;
    interval: number;
  };
  useGitignore: boolean;
};

function must(condition: any, errMsg: string) {
  if (!condition) console.log(chalk.red(errMsg));
}

let config = yaml.load(fs.readFileSync("config.yml", "utf-8")) as Config;
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
config.include = config.include.map((i) =>
  i.startsWith("~") ? home + i.slice(1) : i
);

export default config;
