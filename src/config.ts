import { load } from "js-yaml";
import { readFileSync } from "fs";
import { homedir } from "os";
import { defaultsDeep } from "lodash";
import { must } from "./utils";
import { Config, defaultConfig, PathMapping } from "./model";

const filename = process.argv.length > 2 ? process.argv[2] : "config.yml";

const config = defaultsDeep(
  {},
  JSON.parse(JSON.stringify(defaultConfig)), // deep copy default config
  load(readFileSync(filename, "utf-8"))
) as Config;

must(config.storage.bucket, `Bucket name can't be empty.`);

// replace home dir to absolute paths
let home = homedir().replaceAll("\\", "/");
function replaceHomeDir(pm: PathMapping) {
  if (pm.local.startsWith("~")) pm.local = home + pm.local.slice(1);
}
config.upload.map(replaceHomeDir);
config.download.map(replaceHomeDir);

export default config;
