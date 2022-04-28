import * as fs from "fs";
import * as yaml from "js-yaml";

let cache: {
  [key: string]: string;
} = {};

const filename = ".cache.yml";

export default {
  loadCache() {
    try {
      cache = yaml.load(fs.readFileSync(filename, "utf-8")) as {
        [key: string]: string;
      };
    } catch {
      cache = {};
    }
  },
  saveCache() {
    fs.writeFileSync(filename, yaml.dump(cache), "utf-8");
  },
  get(key: string) {
    return cache[key];
  },
  set(key: string, value: string) {
    cache[key] = value;
  },
};
