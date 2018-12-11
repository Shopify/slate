---
id: version-1.0.0-beta.13-deploy-environments
title: Deploy environments
original_id: deploy-environments
---

Manages the environment variables which are needed by Slate to interact with Shopify servers. Can create and run `.env` files used to store Slate environment variables for development.

By default, Slate will look for a `.env` file with environment variables.

Alternatively, users can specify `--env` with slate-tools scripts to use associated `.env.{env}` file. For example:

```bash
$ slate-tools start --env=production
```

will look for a `.env.production` file.

## Default .env file format

```bash
# The myshopify.com URL to your Shopify store
SLATE_STORE=

# The API password generated from a Private App
SLATE_PASSWORD=

# The ID of the theme you wish to upload files too
SLATE_THEME_ID=

# A list of file patterns to ignore, with each list item seperated by ':'
SLATE_IGNORE_FILES=
```
