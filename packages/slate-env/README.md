#@shopify/slate-env

Manages the environment variables which are needed by Slate to interact with Shopify servers. Can create and run `.env` files used to store Slate environment variables for development.

By default, Slate will look for a `.env` file with environment variables.

Alternatively, users can specify `--env` with slate-tools scripts to use associated `.env.{env}` file. For example:

```
$ slate-tools start --env production
```

will look for a `.env.production` file.

## Default .env file format

```bash
# This file contains the information needed for Shopify to authenticate
# requests and edit/update your remote theme files.
#
# 1. Set up a private app (https://help.shopify.com/api/guides/api-credentials#generate-private-app-credentials)
#    with "Read and write" permissions for "Theme templates and theme assets".
# 2. Replace the required variables for each environment below.
#
# password, theme_id, and store variables are required.
#
# Ignore Files accepts multiple patterns, seperated with ':'
#
# For more information on this config file:
#   Configuration variables | http://shopify.github.io/themekit/configuration/
#   Ignore patterns | http://shopify.github.io/themekit/ignores/

SLATE_PASSWORD=
SLATE_THEME_ID=
SLATE_STORE=
SLATE_IGNORE_FILES=
```
