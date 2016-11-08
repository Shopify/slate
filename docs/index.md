---
layout: default
---

# Slate

Slate is a barebones starting point and command line tool for developing Shopify themes. It is designed to assist your development workflow and speed up the process of developing, testing, and deploying themes to Shopify stores.

It allows you to sync local files with your live shop, deploy to multiple environment at the same time, and organize stylesheets and scripts in a flexible way.

## Getting started

* Install Slate with `npm install @shopify/slate`
* Create a new theme with `slate theme theme-name` where `theme-name` will be a newly created folder
* Rename `config-sample.yml` to `config.yml` and add your private app credentials. [How to create a private app](https://help.shopify.com/api/guides/api-credentials#generate-private-app-credentials)
  * **store:** the shopify-specifc URL for this store/environment (ie. my-store.myshopify.com)
  * **theme_id:** the unique id for the theme you want to write to when deploying to this store/environment. Use `"live"` for the published theme
  * **password:** the password generated via a private app on this store/environment (necessary for API access)
* From within your new project folder in your command line, use the commands below to build, sync, and watch your local files

> [Node](https://nodejs.org/en/) v5.3+ is required to fully benefit from Slate. If you want the template files without the build tools, get the latest zip here (TO DO: link).

## Slate commands

### Global
* `slate -h` - Options available in your current directory (differs if not in a theme)
* `slate -v` - See your current version of Slate and any dependencies

### Theme
* `slate build` — Concatenates JS and SCSS, optimizes SVG icons to be used as snippets, and copies over all other files and folders to a `dist` folder
* `slate deploy` — Builds your `dist` folder and replaces the theme set in config.yml
* `slate watch` — Listens for changes to your local source files and deploys them to your shop
* `slate start` — Runs build, deploy, then watch to get you developing on your shop quickly
* `slate zip` — Builds and compresses your `dist` to a zip for easy manual upload

> Learn more about [all commands and descriptions](/slate/commands/) or how to [deploy to multiple environments](/slate/commands/#syncing-commands).
