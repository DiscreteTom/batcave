# Batcave

Backup your files to AWS S3.

## Config

`config.yml`

```yml
storage:
  bucket: BUCKET_NAME
  prefix: PREFIX/
  queueSize: 4
  partSize: 5 # MB
  profile: default
include:
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
  - "**/node_modules"
  - "**/.venv"
excludeFolderContains:
  - .gitignore
  - .git
```
