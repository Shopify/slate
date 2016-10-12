# Slate CLI
[![CircleCI](https://circleci.com/gh/Shopify/slate-cli.svg?style=svg&circle-token=83ed3f203115767f7bc4e6f3be07cb93788f4bd2)](https://circleci.com/gh/Shopify/slate-cli)

Slate is a command line tool for Shopify Theme development.  It's designed to assist your development workflow
and speed up the process of developing, testing and deploying themes to Shopify stores.

### Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Updating Slate](#updating)
- [Global Commands](#global-commands)
- [Theme Commands](#theme-commands)
- [Troubleshooting](#troubleshooting)
- [Licence](#license)

## Installation

#### 1. Get the latest version
Clone the latest version of Slate CLI to your local machine using SSH
(see [github's guide to SSH](https://help.github.com/articles/generating-an-ssh-key/) for help):

```shell
git clone git@github.com:Shopify/slate-cli.git
```

#### 2. Run npm link
```shell
cd slate-cli
npm link
```
_note: if you get an **`EACCES`** error, you may need to run `sudo npm link` instead_

This command installs node dependencies (equivalent to running `npm install`) and creates
a symbolic link to your global npm directory.

You should now be able to run slate from your terminal. Try running `slate -v` to verify that everything worked
(if this didn't work, see [Troubleshooting](#troubleshooting) for guidance).

## Getting started

#### 1. Create a new project
Run the following commands to create a new project:

```shell
slate new theme <my-theme-name>
```

You will be prompted with some questions to help configure your theme.  A new directory will be created within the
current directory (similar to `git clone`).

Once the boilerplate has been generated, Slate runs `npm install` to download remaining dependencies (~1min).

#### 2. Configure your Store / Environment settings
When the theme generator has finished, the theme's `config.yml` file will open automatically.
You will need to fill in the required fields for each store / environment. Comment out any environments that you want to set up later or Theme Kit will throw an error.

> _For more details on configuring your environments please see our
**[Store configuration guide](https://github.com/Shopify/slate-cli/blob/master/store-configuration.md)**._

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

 A [Browsersync](https://browsersync.io/) proxy will run when deployment is complete and automatically launch in your browser.
 Slate will begin watching your theme directory for file changes and deploy them to your store whenever you make a change.  Browsersync
 will live-reload as soon as your changes are deployed.

## Updating Slate

1. Pull the latest version from GitHub - Make sure that your current branch is master and that your master branch is up-to-date.
2. Run `npm update` - This will update all project dependencies and developer tools listed in the [package.json](package.json) file.
3. Run `npm prune` and `npm install` (optional) - After major changes, it may be necessary to clean out your `node_modules` and
make sure that new modules have been correctly installed.

   This will remove any unused dependencies from `node_modules` and install all new dependencies.

## Global commands

Command                      | Usage
---                          | ---
[new theme](#new-theme)      | `slate new theme [name]`
[new section](#new-section)  | `slate new section [name]`
[help](#help)                | `slate -h`
[version](#version)          | `slate -v`

### new theme
```
slate new theme [name]
```

Generates a theme with build tools. The name argument is required and you will be prompted to enter it if it's not provided.

### new section
```
slate new section [name]
```

Generates a new section folder in `src/sections` and the four files that will make up an individual section: `javascript.js`, `schema.json`, `style.liquid` and `template.liquid`. The name argument is required and you will be prompted to enter it if it's not provided.

See the [Shopify liquid documentation](https://help.shopify.com/themes/development/storefront-editor/sections) for more information on section syntax.

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
[test](#test)         | `slate test`
[watch](#watch)       | `slate watch [--options]`
[zip](#zip)           | `slate zip`

### build
```
slate build
```

Compiles your theme files and assets into a Shopify theme, found in the `dist` folder.

### deploy
```
slate deploy [--options]
```

Performs a fresh build followed by a full deploy; replacing existing files on the remote server and replacing them with the full set of build files, and removing remote files that are no longer in use.

Running `slate deploy --manual` will instead create a new zip file of your theme (see [slate zip](#zip)) and open the admin themes page as defined by your environment where you can then manually install your theme from the zip file.

#### options
```
-e, --environment  deploy to a comma-separated list of environments
-m, --manual       disable auto-deployment of the theme files
```

### start
```
slate start [--options]
```

Performs a full deploy of your theme (see [slate deploy](#deploy)), launches [Browsersync](https://browsersync.io/) in a new browser tab at [https://localhost:3000](https://localhost:3000) and watches for any file changes.

#### options
```
-e, --environment  deploy to a comma-separated list of environments
-n, --nosync       watch for changes without using Browsersync
```

### test
```
slate test
```

Runs the tests and linting tasks for a theme's JavaScript, CSS and JSON.


### watch
```
slate watch [--options]
```

Sets up the watchers for all theme assets.

By default, [Browsersync](https://browsersync.io/) will launch a new browser tab at
[https://localhost:3000](https://localhost:3000) and watch for any files changes. You can ignore this
by passing the `--nosync` option to the command.

#### options
```
-e, --environment  deploy to a specific environment
-n, --nosync       watch for changes without using Browsersync
```

### zip
```
slate zip
```

Performs a fresh build of your theme and zips it into a file that's compatible with Shopify.
The zip file can be found within an upload folder that is generated within your theme project root folder.
The zip is overwritten each time you use this command and is not meant to be used for versioning.

## Troubleshooting
If you encounter any issues, here are some preliminary steps to take:

- `git pull` latest version of Slate CLI.
- `npm install` to make sure you have all the dependencies.
- `npm link` to make sure that the symlink exists and Slate CLI is globally installed.

## License
This project is licensed under the terms of the [MIT license](LICENSE).
