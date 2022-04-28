import * as fs from "fs";
import * as glob from "glob";
import config from "./config";
import uploader from "./uploader";

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
);
