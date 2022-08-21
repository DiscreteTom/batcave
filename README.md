# Batcave

[![npm](https://img.shields.io/npm/v/@discretetom/batcave?style=flat-square)](https://www.npmjs.com/package/@discretetom/batcave)

Use AWS S3 as a file backup service.

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
  profile: default # local aws profile
  region: us-east-1 # region of your s3 bucket
  class: STANDARD # s3 storage class
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
  # you can use glob filters to filter files
  - local: /home/ubuntu/Musics
    filters:
      - exclude: "*" # use glob expression to exclude files
      - include: "*.mp4" # use include to escape from exclude
# same rules as the upload
# by default, download tasks will be executed after upload tasks
download:
  - local: ~/Documents
filters: # global filters
  - exclude: "**/node_modules"
```

Then you can use `batcave backup.yml` to backup your files.

Add the option `--dry` to displays the operations that would be performed using the specified command without actually running them.
