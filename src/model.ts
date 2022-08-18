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
      /** How long to wait if the concurrent limit is reached, in ms. */
      interval: 2000,
    },
  },
  /** Specify how to scan local folders. */
  scan: {
    concurrent: {
      /** How many folders will be scanned concurrently. */
      limit: 100,
      /** How long to wait if the concurrent limit is reached, in ms. */
      interval: 1000,
    },
  },
  /** Specify how to cache the time modified. */
  cache: {
    /** Specify how to cache folder contents. */
    folder: {
      /** The name of the file where to cache folder's direct files time modified. */
      lockFile: "batcave.lock",
    },
    /** Specify how to cache top level files. */
    file: {
      /** The key of the object's tag where to cache file's time modified. */
      tag: "TimeModified",
    },
  },
  upload: [] as PathMapping[],
  download: [] as PathMapping[],
  // plugins: [] as string[],
});

export type Config = {
  -readonly [k in keyof typeof defaultConfig]: typeof defaultConfig[k];
};
