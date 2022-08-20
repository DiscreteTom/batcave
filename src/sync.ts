import { S3Client } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import config from "./config";
import S3SyncClient = require("s3-sync-client");
import { Lock } from "./lock";

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
export async function sync(from: string, to: string) {
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
    });
  });
}
