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
    class: "GLACIER_IR",
  },
  upload: [] as PathMapping[],
  download: [] as PathMapping[],
  // plugins: [] as string[],
});

export type Config = {
  -readonly [k in keyof typeof defaultConfig]: typeof defaultConfig[k];
};
