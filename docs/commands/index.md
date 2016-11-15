---
layout: default
---

# Commands

## Global commands

| Command | Usage |
| :------ | :---- |
| [theme](#theme) | `slate theme [name]` |
| [help](#help) | `slate -h` |
| [version](#version) | `slate -v` |

### theme

```
slate theme [name]
```

Generate a theme with build tools. The name argument is required and you will be prompted to enter it if it's not provided.

### help

```
slate [command] -h, slate [command] --help
```

Outputs help information for Slate (`slate --help`) or a specific command (`slate deploy --help`).

### version

```
slate -v, slate --version
```

Outputs the current version of Slate and its dependencies installed on your system.

## Build commands

Slate's source theme files are in the root `src` folder. These are the files you edit and will be compiled to a Shopify-compatible theme in the `dist` folder. You can do this a few different ways.

| Command | Usage |
| :------ | :---- |
| [build](#build) | `slate build` |
| [zip](#zip) | `slate zip` |

### build

```
slate build
```

Compile theme files and assets into a Shopify theme, found in the `dist` folder. No files will be uploaded to your shop.

### zip

```
slate zip
```

Performs a fresh build of your theme and zips it into a file that's compatible with Shopify. The zip file can be found within an upload folder that is generated within your theme project root folder. The zip is overwritten each time you use this command and is not meant to be used for versioning.

## Sync commands

| Command | Usage |
| :------ | :---- |
| [deploy](#deploy) | `slate deploy [--options]` |
| [watch](#watch) | `slate watch [--options]` |
| [start](#start) | `slate start [--options]` |

### deploy

```
slate deploy [--options]
```

Performs a fresh build followed by a full deploy; replacing existing files on the remote server and replacing them with the full set of build files, and removing remote files that are no longer in use.

##### Options

```
-e, --env  deploy to a comma-separated list of environments
-m, --manual  disable auto-deployment of the theme files
```

Running `slate deploy --manual` will instead create a new zip file of your theme (see [slate zip](#zip)) and open the admin themes page as defined by your environment where you can then manually install your theme from the zip file.

Deploy to a different environment with the `-e` flag (short for `--env`) plus the environment name, or multiple environments at once with comma separated values
```
slate deploy -e staging
slate deploy -e development,staging,production
```

### watch

```
slate watch [--options]
```

Sets up the watchers for all theme assets and deploys the compiled versions to your specified environment (default is `development`). Also opens a [Browsersync](https://browsersync.io/) window with live reloading after changing and saving a file.

##### Options
```
-e, --env  deploy to a specific environment
-n, --nosync  disable Browsersync
```

### start

```
slate start [--options]
```

Performs a full deploy of your theme (see [slate deploy](#deploy)) and starts the watchers (see [slate watch](#watch)).

##### Options
```
-e, --env  deploy to a comma-separated list of environments
-n, --nosync  disable Browsersync
```
