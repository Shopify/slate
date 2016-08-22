# Slate CLI
[![CircleCI](https://circleci.com/gh/Shopify/slate-cli.svg?style=svg&circle-token=83ed3f203115767f7bc4e6f3be07cb93788f4bd2)](https://circleci.com/gh/Shopify/slate-cli)

Slate CLI is a command line tool for theme development that allows you to run commands to generate, set up, and deploy Shopify themes.

## Installation

#### 1. Get the latest version
Clone the latest version of Slate CLI to your local machine by running:

```shell
git clone https://github.com/Shopify/slate-cli
cd slate-cli
```

or with SSH ([guide on setting up ssh here](https://help.github.com/articles/generating-an-ssh-key/))

```shell
git clone git@github.com:Shopify/slate-cli.git
cd slate-cli
```

#### 2. Run `npm link`
This will install project dependencies and developer tools listed in the [package.json](package.json) file. It also creates a symbolic link from this project to your global npm directory.

#### 3. Run `slate setup`
This installs project-specific dependencies and developer tools. More details [here](#setup).

## Getting started

#### 1. Create a new project
Run the following commands to create a new project and replace `my-theme` with the name of your Shopify theme.

```shell
slate new theme my-theme
cd my-theme
```

#### 2. Add your store settings in `config.yml`.
These settings include the theme ID, password, and store URL.

- **store**

  Navigate to your store's admin and copy the `my-store.myshopify.com` URL.
  
  ![https://screenshot.click/17-14-qesa7-jgfrc.png](https://screenshot.click/17-14-qesa7-jgfrc.png)

- **theme_id**

  Navigate to your store's themes and append `.xml` or `.json` to the URL.
  
  ![https://screenshot.click/17-02-w0fw2-zczky.png](https://screenshot.click/17-02-w0fw2-zczky.png)
  
  Copy the `id` for the theme you would like to update.
  
  ![https://screenshot.click/17-04-mng8o-k9da8.png](https://screenshot.click/17-04-mng8o-k9da8.png)
  
  Note: if `theme_id` is set to "live", it will update the published theme.
  
- **password**

  Navigate to your store's private apps.
  
  ![https://screenshot.click/17-06-j9e9m-n2jxa.png](https://screenshot.click/17-06-j9e9m-n2jxa.png)
  
  Create a new private app and copy the password.
  
  ![https://screenshot.click/17-07-u19kf-rx53b.png](https://screenshot.click/17-07-u19kf-rx53b.png)
  
  Assign the private app permissions to "Read and Write" for theme templates and theme assets.
  
  ![https://screenshot.click/17-09-owv1p-5lugl.png](https://screenshot.click/17-09-owv1p-5lugl.png)

See [config variables](http://themekit.cat/docs/#config-variables) for more details.

#### 3. Run `slate start`
This command will build your theme from the [source files](https://github.com/Shopify/slate/tree/master/src) into a `dist` directory. A [Node.js](https://nodejs.org) server and [Browsersync](https://browsersync.io/) will start automatically once the initial build is complete. Browersync will livereload the localhost as files are changed in the theme.

## Commands

### Global options

#### Help `-h, --help`
Outputs help information for Slate or a specific command.

#### Version `-v, --version`
Outputs the current version of Slate CLI installed on your system.

### Global commands

Global commands setup Slate CLI dependencies and generate boilerplate code.

Command                      | Usage
---                          | ---
[setup](#setup)              | `slate setup`
[new theme](#new-theme)      | `slate new theme [name]`
[new section](#new-section)  | `slate new section [name]`

#### setup
```
slate setup
```

Installs [Theme Kit](http://themekit.cat/), a cross-platform tool which provides utilities that allow you to interact with Shopify themes.

#### new
```
slate new [args]
```

Generates boilerplate code for your theme.

##### new theme
```
slate new theme [name]
```

Generates a theme with build tools. The name argument is required and you will be prompted to enter it if it's not provided.

##### new section
```
slate new section [name]
```

Generates a new section folder in `src/sections` and the four files that will make up an individual section: `javascript.js`, `schema.json`, `style.liquid` and `template.liquid`. The name argument is required and you will be prompted to enter it if it's not provided.

See the [Shopify liquid documentation](https://help.shopify.com/themes/development/storefront-editor/sections) for more information on section syntax.

### Theme commands

Theme commands allow you to interact with theme dependent utilities, such as starting a local server, compiling and deploying assets to a Shopify store.

Command               | Usage
---                   | ---
[build](#build)       | `slate build`
[deploy](#deploy)     | `slate deploy [--options]`
[start](#start)       | `slate start [--options]`
[test](#test)         | `slate test`
[watch](#watch)       | `slate watch [--options]`
[zip](#zip)           | `slate zip`

#### build
```
slate build
```

Compiles your theme files and assets into a Shopify theme, found in the `dist` folder.

#### deploy
```
slate deploy [--options]
```

Performs a fresh build followed by a full deploy; replacing existing files on the remote server and replacing them with the full set of build files, and removing remote files that are no longer in use.

Running `slate deploy --manual` will instead create a new zip file of your theme (see [slate zip](#zip)) and open the admin themes page as defined by your environment where you can then manually install your theme from the zip file.

##### options
```
-e, --environment  deploy to a comma-separated list of environments
-m, --manual       disable auto-deployment of the theme files
```

#### start
```
slate start [--options]
```

Performs a full deploy of your theme (see [slate deploy](#deploy)), launches [Browsersync](https://browsersync.io/) in a new browser tab at [https://localhost:3000](https://localhost:3000) and watches for any file changes.

##### options
```
-e, --environment  deploy to a comma-separated list of environments
-n, --nosync       watch for changes without using Browsersync
```

#### test
```
slate test
```

Runs the tests and linting tasks for a theme's JavaScript, CSS and JSON.


#### watch
```
slate watch [--options]
```

Sets up the watchers for all theme assets.

By default, [Browsersync](https://browsersync.io/) will launch a new browser tab at [https://localhost:3000](https://localhost:3000) and watch for any files changes. You can ignore this by passing the `--nosync` option to the command.

##### options
```
-e, --environment  deploy to a specific environment
-n, --nosync       watch for changes without using Browsersync
```

#### zip
```
slate zip
```

Performs a fresh build of your theme and zips them into a file that's compatible with Shopify. The zip file can be found within an upload folder that is generated within your theme project root folder. The zip is overwritten each time you use this command and is not meant to be used for versioning.

## Help
If you encounter any issues, here are some preliminary steps to take:

- `git pull` latest version of Slate CLI.
- `npm install` to make sure you have all the dependencies.
- `slate setup` to make sure all Slate CLI dependencies are installed.
- `npm link` to make sure that the symlink exists and Slate CLI is globally installed.

## License
This project is licensed under the terms of the [MIT license](LICENSE).
