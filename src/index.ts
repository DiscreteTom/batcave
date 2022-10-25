#!/usr/bin/env node

import config from "./config";
import { Filter, PathMapping, SyncOptions } from "./model";
import { exec } from "child_process";
import { opts } from "./args";

config.upload.forEach((pm) => {
  sync(
    `${pm.local}`,
    `s3://${config.storage.bucket}/${config.storage.prefix}${pm.remote}`,
    pm
  );
});
config.download.forEach((pm) => {
  sync(
    `s3://${config.storage.bucket}/${config.storage.prefix}${pm.remote}`,
    `${pm.local}`,
    pm
  );
});

function optionsToString(options: SyncOptions) {
  const result = [] as string[];
  Object.keys(options).forEach((key) => {
    result.push(`--${key}`, options[key]);
  });
  return result.join(" ");
}

function filtersToString(filters: Filter[]) {
  const result = [] as string[];
  filters.forEach((f) => {
    if ("include" in f)
      result.push(
        "--include",
        ['"', "'"].includes(f.include[0]) ? f.include : `"${f.include}"`
      );
    if ("exclude" in f)
      result.push(
        "--exclude",
        ['"', "'"].includes(f.exclude[0]) ? f.exclude : `"${f.exclude}"`
      );
  });
  return result.join(" ");
}

function sync(from: string, to: string, pm: PathMapping) {
  let cmd = [
    `aws`,
    `s3`,
    `sync`,
    from,
    to,
    optionsToString(config.options),
    filtersToString(config.filters),
    optionsToString(pm.options),
    filtersToString(pm.filters),
  ].join(" ");

  if (opts.dry) {
    console.log(cmd);
  } else {
    exec(cmd);
  }
}
