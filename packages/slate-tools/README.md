# @shopify/slate-tools

Slate Tools provides developers with a sophisticated development experience to build top-notch themes.

## Using the Tool

### Not Global

There are [various compelling reasons](https://www.smashingmagazine.com/2016/01/issue-with-global-node-npm-packages/) why we should not rely on global npm packages.

To have access to Slate's CLI commands, you then have three options:

* In the terminal, append the path to your local package to the command like so: `./node_modules/.bin/slate-tools command`
* Use [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b): `npx slate-tools command`
* In the `package.json` file, you can create yarn/npm scripts to proxy the commands, like this:

  ```
  scripts: {
    xxx: 'slate-tools command',
    ...
  }

  // In the terminal:
  // yarn xxx --someflag
  ```

### API Commands

Here are the available API commands for Slate:

`start [--env=my-custom-env-name] [--skipPrompts]`

* Starts the webpack-dev-server, deploys a first build to Shopify and launches the theme preview site
* Will serve assets on `https://localhost:8080`
* (Optional) You can pass it an environment as a flag; e.g. `--env=my-custom-env-name` would look for `.env.my-custom-env-name` file
* (Optional) You can skip all prompts using the `--skipPrompts` flag. This is especially useful when using Slate Tools in CI.

`build`

* Builds a production-ready version of the theme and outputs it to the `dist` folder

`deploy [--env=my-custom-env-name] [--skipPrompts] [--replace]`

* Push the compiled theme from the `dist` folder to Shopify
* (Optional) You can pass it an environment as a flag; e.g. `--env=my-custom-env-name` would look for `.env.my-custom-env-name` file
* (Optional) You can skip all prompts using the `--skipPrompts` flag. This is especially useful when using Slate Tools in CI.
* (Optional) By default, the deploy command updates any existing files, and adds any new files to your Shopify store's theme. Use this flag to replace all files on your theme with those of your Slate project. This will delete all files from your Shopify theme which are not in your Slate project.

`zip`

* Zips the contents of `dist` to a archive in the root folder.

`lint [--scripts] [--styles] [--locales]`

* Lint script, styles, and locales files for errors. [ESLint](https://eslint.org/) is used for JS files and can be configured via an `.eslintrc` file in the root folder of your theme. [Stylelint](https://stylelint.io/) is used for SCSS, SASS, and CSS files and can be configured via `.stylelintrc` file in the root folder of your theme. [Theme Lint](https://github.com/Shopify/theme-lint) is used for linting locales files.
* (Optional) You can pass it a `--scripts` flag to only lint script files.
* (Optional) You can pass it a `--styles` flag to only lint styles files.
* (Optional) You can pass it a `--locales` flag to only lint locales files.

`format [--scripts] [--styles] [--json]`

* Formats your theme code according to the rules declared in your `.eslintrc` and `.stylelintrc` files. Uses [ESLint Fix](https://eslint.org/docs/user-guide/command-line-interface#--fix) to format JS files. Uses [Stylelint Fix](https://stylelint.io/user-guide/faq/#how-do-i-automatically-fix-stylistic-violations) to format SCSS, SASS, and CSS files. Uses [Prettier](https://github.com/prettier/prettier) to format JSON files.
* (Optional) You can pass it a `--scripts` flag to only format script files.
* (Optional) You can pass it a `--styles` flag to only format styles files.
* (Optional) You can pass it a `--json` flag to only format json files.

## Caveats

### How to prevent Webpack from parsing some liquid methods and filters

Webpack will loop through your liquid files and parse the liquid helpers to compile the relevant assets. For example, if it detects a `<img src="{{ 'lamp.png' | asset_url }}>"` in a file, it will grab that `lamp.png` image and pass it through the build process.

If, for some reason, one file should not be picked up by Webpack, you can escape this process by using double quotes inside of the liquid expression, like so `<img src='{{ "lamp.png" | asset_url }}>'`. When using this escape hatch, you should not include a relative link to your asset but instead simply write it's name.

### How to make HMR-compliant code

To be able to use some sweet sweet HMR in your flow, you either need to use a framework that supports it (e.g. React, Vue, etc.) or modify your JS modules to be HMR-compatible. More info on how to do that [here](http://andrewhfarmer.com/webpack-hmr-tutorial/#part-2-code-changes).
