import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import * as fs from "fs";
import config from "./config";
import * as chalk from "chalk";
import { lock } from "./lock";
import { PathMapping } from "./model";

let s3 = new S3({
  credentials: fromIni({ profile: config.storage.profile }),
  region: config.storage.region,
});

/** Upload a single file. */
export async function uploadFile(pm: PathMapping) {
  // if (pathExcluded(filepath)) {
  //   console.log(chalk.gray(`Ignore: ${filepath}`));
  //   return;
  // }

  const bucket = config.storage.bucket;
  const key = config.storage.prefix + pm.remote;

  // check hash
  // if (cache.get(filepath) == hash) {
  //   console.log(chalk.gray(`Hash match: ${filepath}`));
  //   return;
  // }

  // TODO: check modified date.

  let uploader = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: key,
      Body: fs.createReadStream(pm.local),
    },
    queueSize: config.transfer.multipart.queueSize,
    partSize: config.transfer.multipart.partSize * 1024 * 1024,
  });

  // uploader.on("httpUploadProgress", (p) => {
  //   console.log(p);
  // });

  await uploader.done();

  console.log(chalk.green(`Done: ${pm.local}`));
}

/** Upload a single folder. */
export async function uploadFolder(pm: PathMapping) {
  if (!pm.local.endsWith("/")) pm.local += "/";
  if (!pm.remote.endsWith("/")) pm.remote += "/";

  // if (pathExcluded(folder)) {
  //   console.log(chalk.gray(`Ignore: ${folder}`));
  //   return;
  // }

  let dirents = fs.readdirSync(pm.local, { withFileTypes: true });
  // if (folderExcluded(dirents)) {
  //   console.log(chalk.gray(`Ignore: ${folder}`));
  //   return;
  // }

  // if (
  //   // config.useGitignore &&
  //   dirents.map((d) => d.name).includes(".gitignore")
  // ) {
  //   console.log(chalk.gray(`Apply: ${folder}.gitignore`));
  //   dirents = direntsNotGitignore(folder, dirents);
  // }

  await Promise.all(
    dirents.map(async (d) => {
      const next: PathMapping = {
        local: pm.local + d.name,
        remote: pm.remote + d.name,
      };
      if (d.isDirectory()) await uploadFolder(next);
      else if (d.isFile())
        await lock(async () => {
          await uploadFile(next);
        });
    })
  );
}

// function pathExcluded(path: string) {
//   return config.exclude.map((pat) => minimatch(path, pat)).includes(true);
// }

// function folderExcluded(dirents: fs.Dirent[]) {
//   let names = dirents.map((d) => d.name);
//   return config.excludeFolderContains
//     .map((pat) => names.map((n) => minimatch(n, pat)).includes(true))
//     .includes(true);
// }

// function direntsNotGitignore(path: string, dirents: fs.Dirent[]) {
//   let git = ignParser.compile(fs.readFileSync(path + ".gitignore", "utf8"));
//   return dirents.filter((d) => git.accepts(d.name));
// }
