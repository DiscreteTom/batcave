import { S3Client } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import config from "./config";
import S3SyncClient from "s3-sync-client";
import { PathMapping } from "./model";

const s3 = new S3Client({
  credentials: fromIni({ profile: config.storage.profile }),
  region: config.storage.region,
});

const { sync : _sync } = new S3SyncClient({ client: s3 });

export async function sync(pm: PathMapping){
  await _sync(pm.local, pm.remote, {
    commandInput: {
      StorageClass: config.storage.class,
    },
  });
}
