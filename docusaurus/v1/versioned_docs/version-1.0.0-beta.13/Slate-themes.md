---
id: version-1.0.0-beta.13-slate-themes
title: Slate Themes
original_id: slate-themes
---

Slate themes follow a predetermined file structure. Several of the files listed are optional and can be omitted from your project. However, [Starter Theme](https://github.com/Shopify/starter-theme/), the default starting point when generating a new theme with Slate, will include all files.

A Slate project consists of the following file structure:

## File structure

```bash
├── .babelrc [1]
├── .env [2]
├── .eslintrc [3]
├── .gitignore
├── .stylelintrc [4]
├── package.json [5]
├── slate.config.js [6]
├── yarn.lock [7]
└── src
   ├── assets [8]
   ├── config [9]
   ├── layout [9]
   ├── locales [9]
   ├── scripts [10]
   ├── sections [9]
   ├── snippets [9]
   ├── styles [11]
   └── templates [9]
```

### 1. Babel config

`.babelrc` (optional)

Starter Theme comes with [Babel](https://babeljs.io/) preconfigured with [`shopify/babel-preset-shopify`](https://github.com/Shopify/babel-preset-shopify). You can modify this config file based on your project requirements, or remove it completely if you do not wish to take advantage of ES6+ transpilation for legacy browser support

### 2. Shopify API environment variables

`.env`

Slate will use the environment variables declared in this file to connect to deploy files to your Shopify store. For more information, visit the [`@shopify/slate-env` docs](deploy-environments).

This file, along with any other `.env.{environment}` files, contain sensitive information and should not be commited to Github. These environment files are ignored by default in `.gitignore`.

### 3. ESLint config

`.eslintrc` (optional)

Starter Theme comes with [ESLint](https://eslint.org/) preconfigured with [`shopify/eslint-plugin-shopify`](https://github.com/Shopify/eslint-plugin-shopify). You can modify this config file based on your project requirements, or remove it completely if you do not wish to have JavaScript linting in your project.

### 4. Stylelint config

`.stylelintrc` (optional)

Starter Theme comes with [Stylelint](https://stylelint.io/) preconfigured with [`shopify/stylelint-config-shopify`](https://github.com/Shopify/stylelint-config-shopify). You can modify this config file based on your project requirements, or remove it completely if you do not wish to have style linting in your project.

### 5. Package.json

`package.json`

A copy of the theme `package.json` will be included in your new project. It's a good idea to update its contents to match your new project, such as updating the name, version, repository, author and description.

The `package.json` includes NPM/Yarn scripts for you to be able to use Slate Tools commands easily (e.g. `yarn start`).

### 6. Slate config

`slate.config.js`

The Slate config file enables users to customize Slate to their specific needs. For more information, visit the [`@shopify/slate-config` docs](slate-configuration).

### 7. Yarn.lock

`yarn.lock`

The Shopify Themes Team uses [Yarn](https://yarnpkg.com/en/) while developing themes because of its speed. However, Starter Theme works with NPM as well. Simply delete the `yarn.lock` file and run `npm install` to install the list of dependencies.

### 8. Assets folder

`src/assets/`

Sometimes you need the ability to upload unmodified files to the Shopify server. This is where the `assets` directory comes in. Any files placed inside this directory will be uploaded, as-is, to Shopify.

Files can be referenced in your theme by their file name, such as:

```html
<img src="{{ my-image.jpg | asset_url }}" />
```

You can organize your files within folders inside the `assets` directory, and still reference them by file name. For example, the following image would still be referenced the exact same as the example above:

```bash
└── assets
   └── images
      └── my-image.jpg
```

> ⚠ Slate flattens the folders found in the `assets` directory on build. If you decide to use folders inside your assets directory, avoid duplicate file names because only one file with that file name can exist when the Slate theme is built. The example below shows two images with the same name `my-image.jpg` resulting in only one of the images being included in the compiled theme

```bash
└── src
   └── assets
      ├── image-collection-a
      │   └── my-image.jpg
      └── image-collection-b
         └── my-image.jpg
```

Compiles to:

```bash
└── dist
   └── assets
      └── my-image.jpg
```

### 9. Shopify required files and folders

`src/config`, `src/layout/theme.liquid`, `src/locales`, `src/sections`, `src/snippets`, `src/templates/*.liquid`

The aforementioned [files and folders are required by Shopify](https://help.shopify.com/themes/development/templates) for any given theme.

### 10. JavaScript files

`src/scripts`

This folder constains all your JS modules. See the [Template and Layout Bundles](template-and-layout-bundles) page for more details on the contents of `src/scripts`.

You can use ES6/ES2015's standard, which allows you to require your modules with the `import` syntax:

```js
import { contains } from 'lodash';
import Foo from './modules/foo';
// const Bar = require('./modules/bar') is also available if that's your jam!
```

### 11. Sass, SCSS and CSS files

`src/styles`

Slate fully supports `.css`, `.scss` and `.sass` files and their syntax, including `@import`.

You **must** include your style index file at the top of your `theme.js` file for Webpack to be able to load your styles into its build process. For example:

```js
import '../styles/theme.scss';
```

Liquid variables are accessible in `.css`, `.scss`, and `.sass` files via CSS custom properties that are declared in the `layout/theme.liquid`. Here's more information on [how to use Liquid with CSS custom properties](http://localhost:3000/slate.shopify.com/docs/styles-with-liquid#liquid-with-css-custom-properties)
