# Batcave

Backup your PC files to AWS S3.

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
  queueSize: 4 # multipart upload queue size,
  partSize: 5 # in MB, multipart upload part size
  profile: default # local aws profile
  region: us-east-1 # region of your s3 bucket
include:
  # you can use glob syntax.
  # the leading '~' will be replaced by your home dir.
  # for windows, the home dir is like 'C:/Users/xxx'
  - ~/.aws
  - ~/.cdk
  - ~/.config
  - ~/.git-secrets
  - ~/.git-templates
  - ~/.ssh
  - ~/.vim
  - ~/bin
  - ~/Desktop
  - ~/Documents
  - ~/Downloads
  - ~/Favorites
  - ~/Music
  - ~/Pictures
  - ~/Videos
exclude:
  # you can use glob syntax
  - "**/node_modules"
  - "**/.venv"
  - "**/.git"
excludeFolderContains:
  # you can use glob syntax
  - .gitignore
concurrent:
  limit: 100 # how many files will be processed concurrently
  interval: 2000 # in ms, how long to sleep if the concurrent limit is reached
useGitignore: true # use folder's '.gitignore' to ignore top-level dirents.
```

> Multipart upload configuration: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_storage.html

Then you can use `batcave backup.yml` to backup your files.

## Cache

All included files will be sha256 hashed and saved in `.cache.yml` file.

When you start backup, those hash values will be used to check if your files are modified.
