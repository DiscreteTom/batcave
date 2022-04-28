import * as fs from "fs";
import * as glob from "glob";
import config from "./config";
import uploader from "./uploader";
import cache from "./cache";

cache.loadCache();

process.on("SIGINT", () => {
  cache.saveCache();
  console.log("Cache saved.");
  process.exit(0);
});

// parse include paths
let paths: string[] = [];
config.include.map((i) => paths.push(...glob.sync(i)));

Promise.all(
  paths.map(async (p) => {
    let stat = fs.lstatSync(p);
    if (stat.isDirectory()) {
      await uploader.uploadFolder(p);
    } else if (stat.isFile()) {
      await uploader.uploadFile(p);
    }
  })
).then(cache.saveCache);
