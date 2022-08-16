import { load } from "js-yaml";
import { readFileSync } from "fs";
import { homedir } from "os";
import { defaultsDeep } from "lodash";
import { must } from "./utils";

/** Specify how the local path maps the remote path in S3. */
type PathMapping = {
  /** Local path, should be absolute path, or relative to the home directory(~). */
  local: string;
  /** Remote path relative to the global prefix. */
  remote: string;
};

const defaultConfig = Object.freeze({
  storage: {
    bucket: "",
    prefix: "",
    profile: "default",
    region: "us-east-1",
    storageClass: 'GLACIER_IR'
  },
  transfer: {
    queueSize: 4,
    partSize: 5, // MB
    concurrent: {
      limit: 100,
      interval: 2000,
    },
  },
  upload: [] as PathMapping[],
  download: [] as PathMapping[],
  plugins: [] as string[],
});

type Config = {
  -readonly [k in keyof typeof defaultConfig]: typeof defaultConfig[k];
};

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
