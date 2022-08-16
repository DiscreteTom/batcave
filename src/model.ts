/** Specify how the local path maps the remote path in S3. */
export type PathMapping = {
  /** Local path, should be absolute path, or relative to the home directory(~). */
  local: string;
  /** Remote path relative to the global prefix. */
  remote: string;
};

export const defaultConfig = Object.freeze({
  /** S3 related configurations. */
  storage: {
    /** S3 bucket name. */
    bucket: "",
    /** Global S3 key prefix. */
    prefix: "",
    /** Profile name of your local credentials. */
    profile: "default",
    /** Region of the S3 bucket. */
    region: "us-east-1",
    /** Object storage class. */
    storageClass: "GLACIER_IR",
  },
  transfer: {
    /** See: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_storage.html */
    multipart: {
      /** Multipart upload queue size. */
      queueSize: 4,
      /** Multipart upload part size, in MB. */
      partSize: 5,
    },
    concurrent: {
      /** How many files will be processed concurrently. */
      limit: 100,
      /** How long to sleep if the concurrent limit is reached, in ms. */
      interval: 2000,
    },
  },
  upload: [] as PathMapping[],
  download: [] as PathMapping[],
  plugins: [] as string[],
});

export type Config = {
  -readonly [k in keyof typeof defaultConfig]: typeof defaultConfig[k];
};
