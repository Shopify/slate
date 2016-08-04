# Slate CLI
Slate CLI is a command line tool for [Slate](https://github.com/Shopify/slate) that allows you
to run commands that help with generating, setting up and deploying Shopify themes.

## Getting Started

#### 1. Get the latest version
Clone the latest version of Slate CLI to your local machine by running:
```shell
git clone https://github.com/Shopify/slate-cli
cd slate-cli
```

#### 2. Run `npm link`
This will install both run-time project dependencies and developer tools listed in the [package.json](package.json) file. It also creates a symbolic link from this project to your global npm directory.

#### 3. Run `slate setup`
This will install project specific dependencies and developer tools.

## Global Options

#### Help `-h, --help`
Outputs usage information for generic help. This can also be used for a specific command.

#### Version `-v, --version`
Outputs the current version of Slate CLI installed on your system.

## Overview
This is a list of all Slate CLI commands. Commands are broken down into two groups: global
commands and theme commands.

### [Global Commands](#global-commands-1)
Global commands help with generating boilerplate code and provide practical information
on Slate CLI.

Command                      | Usage
---                          | ---
[setup](#setup)              | `slate setup`
[new theme](#new-theme)      | `slate new theme [name]`
[new section](#new-section)  | `slate new section [name]`

### [Theme Commands](#theme-commands-1)

Theme commands allow you to interact with theme dependent utilities, such as starting a local
server, compiling and deploying assets to a Shopify store. They also act as a wrapper for
all theme gulp tasks.

Command            | Usage
---                | ---
[build](#build)    | `slate build`
[deploy](#deploy)  | `slate deploy [--options]`
[start](#start)    | `slate start`
[test](#test)      | `slate test`
[watch](#watch)    | `slate watch [--options]`
[zip](#zip)        | `slate zip`

## Global Commands

### setup
```
slate setup
```

Installs framework dependencies.

### new
```
slate new [args]
```

Generates boilerplate code for your theme.

#### new theme
```
slate new theme [name]
```

Generates a theme with build tools. The name argument is required and you will be prompted to enter it if it's not provided.

#### new section
```
slate new section [name]
```

Generates a new section folder in `src/sections` and the four files that will make up an individual section: `javascript.js`, `schema.json`, `style.liquid` and `template.liquid`. The name argument is required and you will be prompted to enter it if it's not provided.

See the [Shopify liquid documentation](https://help.shopify.com/themes/development/storefront-editor/sections) for more information on section syntax.

## Theme Commands

### build
```
slate build
```

Compiles your theme files and assets into a suitable Shopify theme file structure, found in the `dist` folder.

### deploy
```
slate deploy [--options]
```

Performs a fresh build followed by a full deploy; replacing existing files on the remote server and replacing them with the full set of build files, and removing remote files that are no longer in use.

Running `slate deploy --manual` will instead create a new zip file of your theme (see [slate zip](#zip)) and open the admin themes page as defined by your environment where you can then manually install your theme from the zip file.

Passing the `--active` option will overwrite the active theme assuming the theme ID is empty (or is not an integer) in `config.yml`.

#### Options
```
-a, --active          Overwrites active theme
-e, --environment     Deploys to a comma-separated list of environments
-m, --manual          Disables auto-deployment of the theme files
```

### start
```
slate start
```

Performs a full deploy of your theme (see [slate deploy](#deploy)), launches Browsersync in a new browser tab at [https://localhost:3000](https://localhost:3000) and watches for any file changes.

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

By default, Browsersync will launch a new browser tab at [https://localhost:3000](https://localhost:3000) and watch for any files changes. You can ignore this by passing the `--nosync` option to the command.

#### Options
```
-ns, --nosync     Stops Browsersync from launching.
```

### zip
```
slate zip
```

Performs a fresh build of your theme and zips them into a file that's compatible with Shopify. The zip file can be found within an upload folder that is generated within your theme project root folder. The zip is overwritten each time you use this command and is not meant to be used for versioning.

## Help
If ever you encounter any issues, running `slate setup` should fix them.

## License
Slate CLI is licensed under the terms of the [MIT license](LICENSE).
