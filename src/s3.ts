import { S3 } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import config from "./config";

export const s3 = new S3({
  credentials: fromIni({ profile: config.storage.profile }),
  region: config.storage.region,
});
