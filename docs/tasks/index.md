---
layout: default
---
# Tasks

## Build tasks

Slate's source theme files are in the root `src` folder. These are the files you edit and will be compiled to a Shopify-compatible theme in the `dist` folder. You can do this a few different ways.

### slate build

A straight build of your `src` folder to `dist`. Nothing will be uploaded to your shop.

```
slate build
```

### slate zip

A build of your `src` folder to `dist` followed by a zip file created into an `upload` folder. This folder will be overwritten if the task is run again so should not be used for version control. Nothing will be uploaded to your shop.

```
slate zip
```

## Sync tasks

### slate deploy

Optional flags: `--environment`, `--manual`

Sync your local theme to an existing theme on the shop. Performs a fresh build before it deploys. Any files on the shop's theme you are deploying to that don't exist in your theme will be removed.

Deploy to your default environment (`development`)
```
slate deploy
```

Deploy to a different environment with the `-e` flag (short for `--environment`) plus the environment name, or multiple environments at once with comma separated values
```
slate deploy -e staging
slate deploy -e development,staging,production
```

Manually upload a zip file with the `-m` flag (short for `--manual). This creates a zip file in the uploads folder and opens your shop’s admin theme page.
```
slate deploy -m
```

### slate watch

Listens for changes to your local source files and deploys the compiled version to your shop. Opens a [Browsersync](https://www.npmjs.com/package/browser-sync) window with live reloading. Disable Browsersync by passing the `-n` flag (short for `--nosync`).

```
slate watch
```

Without Browsersync

```
slate watch -n
```


### slate start

Performs a full deploy, launches BrowserSync and watches for any file changes.

```
slate start
```

Without Browsersync

```
slate start -n
```
