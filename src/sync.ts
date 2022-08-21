import { S3Client } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import config from "./config";
import S3SyncClient = require("s3-sync-client");
import { Lock } from "./lock";
import { Filter } from "./model";
import minimatch = require("minimatch");

// setup s3 client
const s3 = new S3Client({
  credentials: fromIni({ profile: config.storage.profile }),
  region: config.storage.region,
});

// display progress
let current = -1;
function showProgress({ count }) {
  if (count.current != current) {
    current = count.current;
    if (count.current <= count.total)
      console.log(`${count.current}/${count.total}`);
  }
}

const lock = new Lock(1, 1000);

/** Sync remote and local. */
export async function sync(from: string, to: string, pmFilters: Filter[]) {
  await lock.lock(async () => {
    const { sync: _sync } = new S3SyncClient({ client: s3 });
    const monitor = new S3SyncClient.TransferMonitor();
    monitor.on("progress", showProgress);

    console.log(`Sync: ${from} => ${to}`);
    await _sync(from, to, {
      commandInput: {
        StorageClass: config.storage.class,
      },
      monitor,
      filters: config.filters
        .map(filterToFunc)
        .concat(pmFilters.map(filterToFunc)),
      // relocation is required for download
      // see https://github.com/jeanbmar/s3-sync-client/issues/40
      relocations: from.startsWith("s3://")
        ? [
            [
              from
                .slice(5) // remove `s3://`
                .split("/")
                .slice(1) // remove bucket name
                .join("/"),
              "",
            ],
          ]
        : [],
    });
  });
}

function filterToFunc(filter: Filter) {
  if (filter.exclude)
    return { exclude: (key: string) => minimatch(key, filter.exclude) };
  if (filter.include)
    return { include: (key: string) => minimatch(key, filter.include) };
}
