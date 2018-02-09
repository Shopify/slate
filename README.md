# Slate v1.0

[![CircleCI](https://circleci.com/gh/Shopify/slate.svg?style=svg&circle-token=f18ea06638792678e7dbfa1b8413570cd2896dff)](https://circleci.com/gh/Shopify/slate)

> ⚠️ Slate v1.0 is currently an Alpha release. You should expect breaking changes between updates and more bugs than a finalized release. We believe that by getting Slate in the hands of developer communtiy as soon as possible, we can gather more feedback to make it an even bigger success. Slate v1.0 has not yet been tested on Windows.

Slate empowers developers of all skill levels to build quality Shopify themes. Slate guides developers by providing a tested workflow and opinionated development toolkit, while also accommodating more established developers through advanced configuration.

Slate introduces a number of new features and concepts to improve theme development experiences, including:

* Dependency management via [Webpack](https://webpack.js.org/)
* ES6+ support via [Babel](https://babeljs.io/)
* [Local Development Assets Server](#local-development-assets-server)
* [SASS compilation with vendor prefixing and Liquid](#sass-compilation-with-vendor-prefixing-and-liquid)
* [Theme Linting](#theme-linting)
* [Custom Starting Points](#custom-starting-points)
* [Multiple API Credentials](#multiple-api-credentials)
* [Safe watch and deploy](#safe-watch-and-deploy)
* [Optimized production build pipeline](#optimized-production-build)
* [Configuration via slate.config.js](#configuration-via-slate.config.js)

## Table of Contents

* [System Requirements](#system-requirements)
* [Getting Started](#getting-started)
* [Features & Concepts](#features-&-concepts)
* [Guides](#guides)
* [Contributing](#contributing)
* [Code of Conduct](#code-of-conduct)
* [License](#license)

## System Requirements

Slate v1.0 requires Node 8.9.4 or greater and NPM 5+.

## Getting Started

### 1. Create a new project

To get started with a new project, run the following command in your terminal:

```
yarn create slate-theme my-new-theme
```

or

```
npx create-slate-theme my-new-theme
```

By default, `create-slate-theme` creates a copy of [`Shopify/starter-theme`](https://github.com/Shopify/starter-theme) for a new project. See [custom starting themes](#custom-starting-themes) for more information on how you can start a project from other sources.

### 2. Connect to your store

Once you have bootstraped your development app, you will need to setup your `.env` file with the right information provided by Shopify.

Check out the [@shopify/slate-env documentation](https://github.com/Shopify/slate/tree/1.x/packages/slate-env) on how to setup API access and where to find the `SLATE_PASSWORD`, `SLATE_THEME_ID`, and `SLATE_STORE` values necessary for the CLI to interact with the Shopify servers.

### 3. Start developing

To start developing your theme with Slate's development pipeline, call:

```
yarn start
```

This will boot up a local express server and serve most of your assets from `https://localhost:8080`.

> ⓘ Because we are running localhost on `https` you will need to visit this URL at least once and tell your browser to trust it, otherwise local assets will be blocked. Alternatively, you could [create a trusted SSL certificate for localhost](#how-to-create-a-trusted-local-ssl-certificate).

## Features & Concepts

#### Local Development Assets Server

Slate v1.0 introduces a local server which compiles and serves theme assets locally. By serving assets locally, developers don't need to wait for assets to be uploaded to Shopify servers to see the changes they are making. When combined with Hot Module Reloading, developers see changes in their code reflected almost instantly.

Local Development Asset Server only serves assets, not `.liquid` files. There is currently no easy way to compile Liquid files off of Shopify servers. We are aware of how this impacts development and doing our best to find a solution.

#### Local SASS compilation with vendor prefixing and Liquid

In the past, if theme developers wanted to include Liquid variables in their styles (`.scss.liquid` files), those stylesheets could only be compiled on Shopify servers. This is because using Liquid in SASS results in invalid SASS syntax that local SASS compilers cannot read. Theme developers need access to Liquid values in their styles, especially if they want styles to be configurable in the Shopify Theme Editor.

Slate introduces a new way of handling styles made possible through CSS Custom Properties. CSS Custom Properties are the perfect mechanism to link styles to Theme Editor Liquid settings. They allow you you to write valid CSS and SCSS that doesn’t break build tools like PostCSS vendor prefixing, and are supported in all modern browsers.

When local SASS compilation is combined with Slate's Local Development Assets Server, style changes are instantly injected into the page, without waiting for Shopify servers, resulting in a lightning fast development experience.

To support legacy browsers, Slate includes a transpiler that replaces CSS Variables with matching Liquid Variables as a last step in the production `build` script.

For an example, take a look at `Shopify/starter-theme`.

> ⓘ Slate v1.0 currently only supports .scss and .css files. We are working on getting legacy support for `.scss.liquid` and `.css.liquid` files, however they will not be able to take advantage of the features noted above and will rely on Shopify servers for compilation.

#### Theme Linting

JS linting is made available via ESlint and is enabled when you include a `.eslintrc` file in your theme root directory.

Stylesheet linting is made possible via Styelint and is enabled automatically when you include a `.stylelintrc` file in your theme root directory.

> ⓘ Linting is currently only available in the `build` command. A `lint` command made available via `yarn lint` is in the works. We are also working on hooking up [shopify/theme-lint](https://github.com/Shopify/theme-lint).

### Custom Starting Themes

Instead of using [shopify/starter-theme](https://github.com/Shopify/starter-theme), you can optionally specify your own Github repo or local folder to copy as a starting point:

```
yarn create slate-theme my-new-theme shopify/skeleton-theme
```

or

```
yarn create slate-theme my-new-theme my-old-theme/
```

You can share your starting point with the community by publishing your own starter theme to Github. For example, I could publish my own starter theme in the t-kelly/custom-starter-theme repo and then start a new project with it by calling:

```
yarn create slate-theme my-new-theme t-kelly/custom-starter-theme
```

#### Multiple API Credentials

Slate uses environment variables and `.env` files to manage API credentials for connecting to Shopify stores. For more inflormation, take a look at the [`slate-env` README](https://github.com/Shopify/slate/tree/v1.0.0-pre-alpha/packages/slate-env).

#### Safe Watch and Deploy

Slate has a set of flags and warnings baked in to prevent you from pushing code to the main live theme (unless you explicitly want to). This minimizes the risks of deploying changes to the live site while developing 😌.

#### Optimized production build

Slate's `build` script compiles the theme so that it is fully optimized to run in production. These optimizations include:

* Optimized JS via UglifyJS and bundle splitting
* Optimized CSS using cssNano
* Minified HTML

#### Configuration via slate.config.js

The `slate.config.js` file is the master control for configuring Slate to your projects needs.

> ⓘ Configuration options and documentation are currently in progress. Stay tuned for more.

## Guides

### How to create a trusted local SSL certificate

Slate v1.0 uses a local express server and serve most of your assets from `https://localhost:8080`. It's a good idea to create a trusted SSL certificate on your device so localhost assets served via `https` are never blocked.

> ⓘ The below steps probably only work in MacOS.

1. Copy and paste the command below into your terminal to navigate to your home directory, create a folder called `.localhost_ssl`, and then navigate to that folder:

```
cd && mkdir .localhost_ssl && cd .localhost_ssl
```

2. Copy and paste the command below to generate a new SSL certificate and key:

```
openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout server.key \
    -new \
    -out server.crt \
    -subj /CN=localhost \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '[SAN]\nsubjectAltName=DNS:localhost')) \
    -sha256 \
    -days 3650
```

3. Open the current folder by entering `open .` in your terminal, and then double-click on the `server.crt` file.

4. The Keychain Access app should open. Click `Add Certificate`.

5. In the side navigation column of the Keychain Access app, click the **Certificates** category and then double click the `localhost` certificate from the list of certificates.

6. A window will open. Inside the window, click the `> Trust` accordian toggle.

7. Change the `Secure Socket Layer (SSL)` setting to `Always Trust`.

8. Click the `x` in the top left corner of the window. You will be be prompted if you wish to save your changes. Save your changes.

9. Your device should now always trust `https://localhost`

## Contributing

For help on setting up the repo locally, building, testing, and contributing
please see [CONTRIBUTING.md](https://github.com/Shopify/slate/blob/master/CONTRIBUTING.md).

## Code of Conduct

All developers who wish to contribute through code or issues, take a look at the
[Code of Conduct](https://github.com/Shopify/slate/blob/master/CODE_OF_CONDUCT.md).

## License

MIT, see [LICENSE](http://github.com/Shopify/slate/blob/master/LICENSE) for details.

<img src="https://cdn.shopify.com/shopify-marketing_assets/builds/19.0.0/shopify-full-color-black.svg" width="200" />

## Thanks

We would like to specifically thank the following projects, for the inspiration and help in regards to the creation of Slate:

* [create-react-app](https://github.com/facebookincubator/create-react-app)
* [Dynamo's Shopify Pipeline](https://github.com/DynamoMTL/shopify-pipeline)
