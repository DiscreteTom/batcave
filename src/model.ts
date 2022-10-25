/** CLI options without leading `--`. E.g.: `{"quiet": true}` */
export type SyncOptions = { [key: string]: string | number | boolean };

/** See https://docs.aws.amazon.com/cli/latest/reference/s3/index.html#use-of-exclude-and-include-filters . */
export type Filter = { include: string } | { exclude: string };

/** Specify how the local path maps the remote path in S3. */
export type PathMapping = {
  /**
   * Local path, should be absolute path, or relative to the home directory(~).
   *
   * E.g.:
   * - `/home/ubuntu/Documents`
   * - `~/Documents`
   * - `D:\\Data`
   */
  local: string;
  /** Remote path relative to the global prefix. E.g.: `some/folder/` */
  remote: string;
  options: SyncOptions;
  filters: Filter[];
};

export const defaultConfig = Object.freeze({
  /** S3 related configurations. */
  storage: {
    /** S3 bucket name. */
    bucket: "",
    /** Global S3 key prefix. */
    prefix: "",
  },
  /** Global options, will be applied to every upload/download task. */
  options: {} as { [key: string]: string },
  upload: [] as PathMapping[],
  download: [] as PathMapping[],
  /** Global filters, will be applied to every upload/download task. */
  filters: [] as Filter[],
});

export type Config = {
  -readonly [k in keyof typeof defaultConfig]: typeof defaultConfig[k];
};
