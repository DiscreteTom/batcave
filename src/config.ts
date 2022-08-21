import { load } from "js-yaml";
import { readFileSync } from "fs";
import { homedir } from "os";
import { must } from "./utils";
import { Config, defaultConfig, PathMapping } from "./model";

// try to retrieve file name from command line options
const filename = process.argv.length > 2 ? process.argv[2] : "config.yml";

// construct config from default config and config file
const config = JSON.parse(JSON.stringify(defaultConfig)) as Config; // deep copy default config
const customerConfig = load(readFileSync(filename, "utf-8")) as Config;
Object.assign(config.storage, customerConfig.storage);
config.download = customerConfig.download || [];
config.upload = customerConfig.upload || [];

must(config.storage.bucket, `Bucket name can't be empty.`);

const home = homedir().replaceAll("\\", "/");
function processLocal(pms: PathMapping[]) {
  pms.map((pm) => {
    // replace local home dir to absolute paths
    if (pm.local.startsWith("~")) pm.local = home + pm.local.slice(1);
    // replace `\` to `/` for windows system
    pm.local = pm.local.replaceAll("\\", "/");
  });
}
processLocal(config.upload);
processLocal(config.download);

function processRemote(pms: PathMapping[]) {
  const remoteSet = new Set<string>();

  pms.map((pm) => {
    // if no remote, defaults to the local folder name
    if (!pm.remote) pm.remote = pm.local.split("/").at(-1);

    // check duplication
    if (remoteSet.has(pm.remote))
      throw new Error(`Duplicated remote path: ${pm.remote}`);
    remoteSet.add(pm.remote);

    // replace remote path to S3 URI
    pm.remote = `s3://${config.storage.bucket}/${config.storage.prefix}${pm.remote}`;
  });
}
processRemote(config.upload);
processRemote(config.download);

export default config;
