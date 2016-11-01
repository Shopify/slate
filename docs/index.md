---
layout: default
---

# Getting started

Slate is a barebones starting point for developing Shopify themes in an efficient and performant way. It allows you to sync local files with your live shop, deploy to multiple environment at the same time, and organize stylesheets and scripts the way you want.

## Setup your local environment

* Install Slate with `npm install @shopify/slate`
* Create a new theme with `slate new theme theme-name` where `theme-name` will be a newly created folder
* Rename `config-sample.yml` to `config.yml` and add your [private app credentials](https://help.shopify.com/api/guides/api-credentials#generate-private-app-credentials)
* From within your new project folder in your command line, use the tasks below to build, sync, and watch your local files

> [Node](https://nodejs.org/en/) v6.2.1+ is required to fully benefit from Slate. If you want the template files without the build tools, get the latest zip here (TO DO: link).

## Slate commands

### Global
* `slate help` - TBD
* `slate -v` - See your current version of Slate and any dependencies

### Theme
* `slate build` — Concatenates JS and SCSS, optimizes SVG icons to be used as snippets, and copies over all other files and folders to a `dist` folder
* `slate deploy` — Builds your `dist` folder and replaces the theme set in config.yml
* `slate watch` — Listens for changes to your local source files and deploys them to your shop
* `slate start` — Runs build, deploy, then watch to get you developing on your shop quickly
* `slate zip` — Builds and compresses your `dist` to a zip for easy manual upload

> Learn about developing and [deploying to multiple environments](/slate/tasks/#syncing-tasks).
