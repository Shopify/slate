# @shopify/slate-tools

## Using the Tool

### Not Global

There are [various compelling reasons](https://www.smashingmagazine.com/2016/01/issue-with-global-node-npm-packages/) why we should not rely on global npm packages. And as such, we advise you to not do so when using Shopify Pipeline.

To have access to Shopify Pipeline's CLI commands, you then have two options:

* In the terminal, append the path to your local package to the command like so: `./node_modules/.bin/shopify-pipeline command`
* In the `package.json` file, you can create yarn/npm scripts to proxy the commands, like this:

  ```
  scripts: {
    xxx: 'shopify-pipeline command',
    ...
  }

  // In the terminal:
  // yarn xxx --someflag
  ```

  Note that Shopify Pipeline will create those for you on project creation.

### API Commands

Here are the available API commands for Shopify Pipeline:

`start [--env=development]`

* Starts the webpack-dev-server, deploys a first build to Shopify and launches the theme preview site
* Will serve assets on `https://localhost:8080`
* (Optional) You can pass it one of the `shopify.yml`'s environments as a flag; it will default to `development` environment

`build`

* Builds a production-ready version of the theme and outputs it to the `dist` folder

`deploy [--env=development]`

* Push the compiled theme from the `dist` folder to Shopify
* (Optional) You can pass it an environment as a flag; it will default to `.env` environment

`zip`

* Zips the contents of `dist` to a archive in the root folder.

## Caveats

### How to generate a local SSH certificate

In order to be able to use local assets in Shopify's environment, you will need to allow your browser to use `https://localhost:8080` as a safe URL.

To do so, you must:

1. Launch the webpack-dev-server; it will launch the Shopify's theme preview, but will not accept assets coming from `localhost`
2. Navigate to `https://localhost:8080` in the same browser you intend to use for development
3. Discard the warning and proceed to the URL; you will see an error page, but it's cool
4. Go back to the Shopify's theme preview and you should now have local assets working on the distant server

### How to prevent Webpack from parsing some liquid methods and filters

Webpack will loop through your liquid files and parse the liquid helpers to compile the relevant assets. For example, if it detects a `<img src="{{ 'lamp.png' | assert_url }}>"` in a file, it will grab that `lamp.png` image and pass it through the build process.

If, for some reason, one file should not be picked up by Webpack, you can escape this process by using double quotes inside of the liquid expression, like so `<img src='{{ "lamp.png" | assert_url }}>'`. When using this escape hatch, you should not include a relative link to your asset but instead simply write it's name.

### How to make HMR-compliant code

To be able to use some sweet sweet HMR in your flow, you either need to use a framework that supports it (e.g. React, Vue, etc.) or modify your JS modules to be HMR-compatible. More info on how to do that [here](http://andrewhfarmer.com/webpack-hmr-tutorial/#part-2-code-changes).
