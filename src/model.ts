/** Specif how to filter files. */
export type Filter = {
  /** Glob string. */
  include?: string;
  /** Glob string. */
  exclude?: string;
};

/** Specify how the local path maps the remote path in S3. */
export type PathMapping = {
  /** Local path, should be absolute path, or relative to the home directory(~). */
  local: string;
  /** Remote path relative to the global prefix. */
  remote: string;
  filters: Filter[];
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
    class: "STANDARD",
  },
  upload: [] as PathMapping[],
  download: [] as PathMapping[],
  /** Global filters, will be applied to every upload/download task. */
  filters: [] as Filter[],
});

export type Config = {
  -readonly [k in keyof typeof defaultConfig]: typeof defaultConfig[k];
};
