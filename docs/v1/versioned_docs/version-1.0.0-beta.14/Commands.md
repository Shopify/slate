---
id: version-1.0.0-beta.14-commands
title: Commands
original_id: commands
---

The following is a list of all available API commands for Slate Tools:

- [build](#build)
- [deploy](#deploy)
- [format](#format)
- [lint](#lint)
- [start](#start)
- [zip](#zip)

## build

Builds a production-ready version of the theme by compiling the files into the `dist` folder.

```bash
slate-tools build
```

Sets `process.env` to `’production’`, which can be used in Slate config to return production only values, e.g.:

```js
// Array of PostCSS plugins which is passed to the Webpack PostCSS Loader
'webpack.postcss.plugins': (config) => {
  const plugins = [autoprefixer];

  if (process.env.NODE_ENV === 'production') {
    plugins.push(cssnano());
  }
  return plugins;
},
```

## deploy

Uploads the `dist` folder to the Shopify store.

```bash
slate-tools deploy [--env=my-custom-env-name] [--skipPrompts] [--replace]
```

| Flag            | Description                                                                                                                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--env`         | Targets a custom environment file. Setting `--env=production` would use the `.env.production` file                                                                                                                                                                                         |
| `--skipPrompts` | Skips all prompts. This is especially useful when using Slate Tools with continuous integration tools                                                                                                                                                                                      |
| `--replace`     | By default, the deploy command updates any existing files, and adds any new files to your Shopify store's theme. Use this flag to replace all files on your theme with those of your Slate project. This will delete all files from your Shopify theme which are not in your Slate project |

## format

Formats the theme code according to the rules declared in the `.eslintrc` and `.stylelintrc` files. By default, it uses [ESLint Fix](https://eslint.org/docs/user-guide/command-line-interface#--fix) to format JS files, [Stylelint Fix](https://stylelint.io/user-guide/faq/#how-do-i-automatically-fix-stylistic-violations) to format CSS files and [Prettier](https://github.com/prettier/prettier) to format JSON files.

```bash
slate-tools format [--scripts] [--styles] [--json]
```

| Flag        | Description                        |
| ----------- | ---------------------------------- |
| `--scripts` | Runs linting only on script files  |
| `--styles`  | Runs linting only on style files   |
| `--locales` | Runs linting only on locales files |

## lint

```bash
slate-tools lint [--scripts] [--styles] [--locales]
```

| Flag        | Description                       |
| ----------- | --------------------------------- |
| `--scripts` | Runs linting only on script files |
| `--styles`  | Runs linting only on style files  |
| `--json`    | Runs linting only on json files   |

## start

Compiles your local theme files into a `dist` directory, uploads these files to your remote Shopify store and finally boots up a local Express server that will serve most of your CSS and JavaScript.

```bash
slate-tools start [--env=my-custom-env-name] [--skipPrompts] [--skipFirstDeploy] [--liveDeploy]
```

| Flag                | Description                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `--env`             | Targets a custom environment file. Setting `--env=production` would use the `.env.production` file    |
| `--liveDeploy`             | Disables the local Express server (and hot reloading), serving all assets through the Shopify CDN |
| `--skipPrompts`     | Skips all prompts. This is especially useful when using Slate Tools with continuous integration tools |
| `--skipFirstDeploy` | Skips the file upload sequence and simply boots up the local Express server                           |

> ⚠️ Without the `--liveDeploy` flag set, your CSS and JavaScript assets are being served locally, and your theme won’t function on any device outside your network. Regardless, you should [deploy](#deploy) your assets anytime your theme updates are finalized using `slate-tools build && slate-tools deploy`.

## zip

Compiles the contents of the `dist` directory and creates a ZIP file in the root of the project.

```bash
slate-tools zip
```
