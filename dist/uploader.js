"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_1 = require("@aws-sdk/client-s3");
const credential_provider_ini_1 = require("@aws-sdk/credential-provider-ini");
const fs = require("fs");
const config_1 = require("./config");
const minimatch = require("minimatch");
const sha256file = require("sha256-file");
const cache_1 = require("./cache");
const chalk = require("chalk");
const lock_1 = require("./lock");
const ignParser = require("gitignore-parser");
let s3 = new client_s3_1.S3({
    credentials: (0, credential_provider_ini_1.fromIni)({ profile: config_1.default.storage.profile }),
    region: config_1.default.storage.region,
});
async function uploadFile(filepath) {
    if (pathExcluded(filepath)) {
        console.log(chalk.gray(`Ignore: ${filepath}`));
        return;
    }
    let hash = sha256file(filepath);
    let bucket = config_1.default.storage.bucket;
    let key = config_1.default.storage.prefix + filepath;
    // check hash
    if (cache_1.default.get(filepath) == hash) {
        console.log(chalk.gray(`Hash match: ${filepath}`));
        return;
    }
    let uploader = new lib_storage_1.Upload({
        client: s3,
        params: {
            Bucket: bucket,
            Key: key,
            Body: fs.createReadStream(filepath),
        },
        tags: [{ Key: "sha256", Value: hash }],
        queueSize: config_1.default.storage.queueSize,
        partSize: config_1.default.storage.partSize * 1024 * 1024,
    });
    // uploader.on("httpUploadProgress", (p) => {
    //   console.log(p);
    // });
    await uploader.done();
    cache_1.default.set(filepath, hash);
    console.log(chalk.green(`Done: ${filepath}`));
}
async function uploadFolder(folder) {
    if (!folder.endsWith("/"))
        folder += "/";
    if (pathExcluded(folder)) {
        console.log(chalk.gray(`Ignore: ${folder}`));
        return;
    }
    let dirents = fs.readdirSync(folder, { withFileTypes: true });
    if (folderExcluded(dirents)) {
        console.log(chalk.gray(`Ignore: ${folder}`));
        return;
    }
    if (config_1.default.useGitignore &&
        dirents.map((d) => d.name).includes(".gitignore")) {
        console.log(chalk.gray(`Apply: ${folder}.gitignore`));
        dirents = direntsNotGitignore(folder, dirents);
    }
    await Promise.all(dirents.map(async (d) => {
        if (d.isDirectory())
            await uploadFolder(folder + d.name);
        else if (d.isFile())
            await lock_1.default.lock(async () => {
                await uploadFile(folder + d.name);
            });
    }));
}
function pathExcluded(path) {
    return config_1.default.exclude.map((pat) => minimatch(path, pat)).includes(true);
}
function folderExcluded(dirents) {
    let names = dirents.map((d) => d.name);
    return config_1.default.excludeFolderContains
        .map((pat) => names.map((n) => minimatch(n, pat)).includes(true))
        .includes(true);
}
function direntsNotGitignore(path, dirents) {
    let git = ignParser.compile(fs.readFileSync(path + ".gitignore", "utf8"));
    return dirents.filter((d) => git.accepts(d.name));
}
exports.default = {
    uploadFile,
    uploadFolder,
};
