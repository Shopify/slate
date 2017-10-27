# Slate CLI

Slate is a command line tool for Shopify Theme development.  It's designed to assist your development workflow
and speed up the process of developing, testing and deploying themes to Shopify stores.

### Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Updating Slate](#updating-slate)
- [Global Commands](#global-commands)
- [Theme Commands](#theme-commands)
- [License](#license)

## Installation

#### 1. Get the latest version

```shell
npm install -g @shopify/slate
```

_note: if you get an **`EACCES`** error, refer to [Fixing npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions)_

You should now be able to run slate from your terminal. Try running `slate --version` to verify that everything worked.

## Getting started

#### 1. Create a new project
Run the following commands to create a new project:

```shell
slate theme <my-theme-name>
```

You will be prompted with some questions to help configure your theme.  A new directory will be created within the
current directory (similar to `git clone`).

Once the boilerplate has been generated, Slate runs `npm install` to download remaining dependencies (~1min).

#### 2. Configure your Store / Environment settings
When the theme generator has finished, the theme's `config.yml` file will open automatically.
You will need to fill in the required fields for each store / environment. Comment out any environments that you want to set up later or Theme Kit will throw an error.

> _For more details on configuring your environments please see our
**[Store configuration guide](https://github.com/Shopify/slate/blob/master/packages/slate-cli/store-configuration.md)**._

#### 3. Navigating the codebase

The [`/src`](https://github.com/Shopify/slate/tree/master/src) directory is where you develop your theme. It includes
the [standard Theme structure](https://help.shopify.com/themes/development/templates), and a few additional folders.

The contents of `/src` will be compiled into a `dist/` directory during most slate tasks. The compiled files in `/dist`
are the files that will be uploaded to your store.

Some new folders have been included in the `/src` directory:

- `/icons` - custom svg icons. These are converted to snippets for use with `{% include %}` (see [slate#svg-icons](https://github.com/Shopify/slate#svg-icons)).
- `/scripts` - You can add sub-folders to help with organization. `scripts/theme.js` is the main entry point.
- `/scripts/vendor` - external JS. This folder is combined to a `vendor.js` file and included in the main layout.
- `/styles` - You can add sub-folders to help with organization. `styles/theme.scss` is the main entry point.

#### 4. Start developing your Theme
You're ready to start developing with Slate.  To get started, run the following command from your theme directory:

 ```shell
 slate start
 ```

 This will build your theme from the `/src` contents to the format required by Shopify (outputs a `/dist` directory).

 The `/dist` folder will be uploaded to the store / theme_id specified in your default environment.

 Slate will begin watching your theme directory for file changes and deploy them to your store whenever you make a change.

## Updating Slate

```shell
npm install @shopify/slate --global
```

## Global commands

Command                      | Usage
---                          | ---
[theme](#theme)              | `slate theme [name] [--options]`
[migrate](#migrate)          | `slate migrate [--options]`
[help](#help)                | `slate -h`
[version](#version)          | `slate -v`

### theme
```
slate theme [name] [--options]
```

Generates a theme with build tools. The name argument is required and you will be prompted to enter it if it's not provided.

#### options
```
--yarn  installs theme dependencies with yarn instead of npm
```

### migrate
```
slate migrate [--options]
```

Converts an existing theme to work with Slate. Run this command from your project root to install dependencies and restructure your theme files into a `src/` directory.  Empty `icons/`, `styles/` and `scripts/` folders will also be created.

Create `config.yml` in your root using [this sample file](https://github.com/Shopify/slate/blob//master/packages/slate-theme/config-sample.yml), then use [theme commands](#theme-commands) to start developing.

#### options
```
--yarn  installs theme dependencies with yarn instead of npm
```

### help
```
slate [command] -h, slate [command] --help
```

Outputs help information for Slate (`slate --help`) or a specific command (`slate deploy --help`).

### version
```
slate -v, slate --version
```

Outputs the current version of Slate CLI installed on your system.

## Theme commands

Command               | Usage
---                   | ---
[build](#build)       | `slate build`
[deploy](#deploy)     | `slate deploy [--options]`
[start](#start)       | `slate start [--options]`
[test](#test)         | `state test`
[watch](#watch)       | `slate watch [--options]`
[zip](#zip)           | `slate zip`

### build
```
slate build
```

Compiles your theme files and assets into a Shopify theme, found in the `dist` folder. No files will be uploaded to your shop.

### deploy
```
slate deploy [--options]
```

Performs a fresh build followed by a full deploy; replacing existing files on the remote server and replacing them with the full set of build files, and removing remote files that are no longer in use.

Running `slate deploy --manual` will instead create a new zip file of your theme (see [slate zip](#zip)) and open the admin themes page as defined by your environment where you can then manually install your theme from the zip file.

#### options
```
-e, --env  deploy to a comma-separated list of environments
-m, --manual       disable auto-deployment of the theme files
```

Deploy to a different environment with the `-e` flag (short for `--env`) plus the environment name, or multiple environments at once with comma separated values
```
slate deploy -e staging
slate deploy -e development,staging,production
```

### start
```
slate start [--options]
```

Performs a full deploy of your theme (see [slate deploy](#deploy)) and starts the watchers (see [slate watch](#watch)).

#### options
```
-e, --env  deploy to a comma-separated list of environments
```

### test
```
slate test
```

Uses the [@shopify/theme-lint](https://github.com/Shopify/theme-lint) package to run translation tests on your locales found in the `/src/locales` folder. The package checks for untranslated keys inside of your Liquid templates, missing translation keys in specific locale files, and translation key HTML validity.

### watch
```
slate watch [--options]
```

Sets up the watchers for all theme assets and deploys the compiled versions to your shop.

#### options
```
-e, --env  deploy to a specific environment
```

### zip
```
slate zip
```

Performs a fresh build of your theme and zips it into a file that's compatible with Shopify.
The zip file can be found within an upload folder that is generated within your theme project root folder.
The zip is overwritten each time you use this command and is not meant to be used for versioning.

## License

MIT, see [LICENSE.md](http://github.com/Shopify/slate/LICENSE.md) for details.

<img src="https://cdn.shopify.com/shopify-marketing_assets/builds/19.0.0/shopify-full-color-black.svg" width="200" />
