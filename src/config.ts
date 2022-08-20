import { load } from "js-yaml";
import { readFileSync } from "fs";
import { homedir } from "os";
import { defaultsDeep } from "lodash";
import { must } from "./utils";
import { Config, defaultConfig, PathMapping } from "./model";

// try to retrieve file name from command line options
const filename = process.argv.length > 2 ? process.argv[2] : "config.yml";

// construct config from default config and config file
const config = defaultsDeep(
  {},
  JSON.parse(JSON.stringify(defaultConfig)), // deep copy default config
  load(readFileSync(filename, "utf-8"))
) as Config;

must(config.storage.bucket, `Bucket name can't be empty.`);

// replace local home dir to absolute paths
let home = homedir().replaceAll("\\", "/");
function replaceHomeDir(pm: PathMapping) {
  if (pm.local.startsWith("~")) pm.local = home + pm.local.slice(1);
}
config.upload.map(replaceHomeDir);
config.download.map(replaceHomeDir);

// replace remote path to S3 URI
function replaceS3URI(pm: PathMapping) {
  pm.remote = `s3://${config.storage.bucket}/${config.storage.prefix}${pm.remote}`;
}
config.upload.map(replaceS3URI);
config.download.map(replaceS3URI);

export default config;
