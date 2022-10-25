# Batcave

[![npm](https://img.shields.io/npm/v/@discretetom/batcave?style=flat-square)](https://www.npmjs.com/package/@discretetom/batcave)

Use AWS S3 as a file backup service.

## Prerequisites

You must have AWS CLI V2 [installed](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [configured](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html#getting-started-quickstart-new) before using this tool.

> This tool will use [`aws s3 sync`](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/sync.html) command to sync files.

## Installation

```bash
npm install -g @discretetom/batcave
```

## Usage

Create a file e.g. `backup.yml` with the following content:

```yml
storage:
  bucket: BUCKET_NAME # s3 bucket name
  prefix: PREFIX/ # s3 key prefix
options: # global options of `aws s3 sync`
  profile: default # local aws profile
  region: us-east-1 # region of your s3 bucket
filters: # global filters, see: https://docs.aws.amazon.com/cli/latest/reference/s3/index.html#use-of-exclude-and-include-filters
  - exclude: "node_modules"
upload:
  # specify local path and remote path
  # local path can use `~` as the home dir
  # for windows, the home dir is like 'C:/Users/xxx'
  - local: ~/Documents
    remote: Documents
  # you can specify local only
  # then the remote will be the direct folder name
  # in this case, the remote will be `Videos`
  - local: ~/Videos
  # all `\` in local will be replaced to `/`
  # so it's ok to use `\` in local
  - local: ~\Pictures
  # remote path must be unique
  # so the following `remote` will throw an error
  # `Duplicated remote path: Documents`
  - local: /home/ubuntu/doc
    remote: Documents
  # you can use filters to filter files
  - local: /home/ubuntu/Musics
    options: # local options
      dryrun: true
    filters: # local filters
      - exclude: "*"
      - include: "*.mp4"
# same rules as the upload
# by default, download tasks will be executed after upload tasks
download:
  - local: ~/Documents
```

Then you can use `batcave backup.yml` to backup your files.

Add the option `--dry` to displays the operations that would be performed using the specified command without actually running them.
