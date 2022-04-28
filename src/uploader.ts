import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import * as fs from "fs";
import config from "./config";
import * as minimatch from "minimatch";
import * as sha256file from "sha256-file";
import cache from "./cache";

let s3 = new S3({});

async function uploadFile(filepath: string) {
  if (pathExcluded(filepath)) return;

  let hash = sha256file(filepath);
  let bucket = config.storage.bucket;
  let key = config.storage.prefix + filepath;

  // check hash
  if (cache.get(filepath) == hash) return;

  let uploader = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: key,
      Body: fs.createReadStream(filepath),
    },
    tags: [{ Key: config.storage.tagKey, Value: hash }],
    queueSize: config.storage.queueSize,
    partSize: config.storage.partSize * 1024 * 1024,
  });

  uploader.on("httpUploadProgress", (p) => {
    // console.log(p);
  });

  await uploader.done();
  cache.set(filepath, hash);

  console.log(`Done: ${filepath}`);
}

async function uploadFolder(folder: string) {
  if (!folder.endsWith("/")) folder += "/";
  if (pathExcluded(folder)) return;

  let dirents = fs.readdirSync(folder, { withFileTypes: true });
  if (folderExcluded(dirents)) return;

  await Promise.all(
    dirents.map(async (d) => {
      if (d.isDirectory()) await uploadFolder(folder + d.name);
      else if (d.isFile()) await uploadFile(folder + d.name);
    })
  );
}

function pathExcluded(path: string) {
  return config.exclude.map((pat) => minimatch(path, pat)).includes(true);
}

function folderExcluded(dirents: fs.Dirent[]) {
  let names = dirents.map((d) => d.name);
  return config.excludeFolderContains
    .map((pat) => names.map((n) => minimatch(n, pat)).includes(true))
    .includes(true);
}

export default {
  uploadFile,
  uploadFolder,
};
