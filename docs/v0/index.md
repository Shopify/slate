---
layout: default
---

# Slate v0

> ⚠️ **These docs are for Slate v0!** To view the docs for the latest version of Slate, go to the [Slate documentation website](https://shopify.github.io/slate/docs/about).

Slate is a theme scaffold and command line tool for developing Shopify themes. It is designed to assist your development workflow and speed up the process of developing, testing, and deploying themes to Shopify stores.

Slate allows you to sync local files with your live shop, deploy to multiple environments at the same time, and organize stylesheets and scripts in a flexible way.

## Getting started

<blockquote>
Slate works with <a href="https://nodejs.org/en/">Node version 6.x</a>, the current LTS (long-term support) release.  This version is recommended over older versions of Node.
</blockquote>

The steps below walk through installing Slate globally and configuring your development theme to sync with your store. If you want the theme files without the build tools dependency, <a href="https://sdks.shopifycdn.com/slate/latest/slate-theme.zip" data-ga-track="slateZip">get the latest zip here</a>.

### Create a new project

1.  Install Slate with `npm install -g @shopify/slate`.
2.  Create a new theme with `slate theme theme-name`, where `theme-name` will be a newly created folder.

* If you already have a theme locally, you can use the `slate migrate` command and [follow these steps](/slate/commands/#migrate) instead.

### Connect your project with your Shopify store

1.  Edit the `config.yml` by adding your store's URL to the `development` environment.

* **store:** the Shopify-specific URL for this store/environment (ie. my-store.myshopify.com)
* Note: You can complete the rest of the configuration in later steps.

2.  Run `slate deploy -m` to start a manual deploy to your Shopify store.

* Slate will build a Shopify theme and open your store's admin.
* A zip of your project will be created in the project's `upload` directory.

3.  Upload the theme zip file at Shopify [admin/themes](https://shopify.com/admin/themes).

* Not sure how to upload a theme zip? Learn how at [Upload a theme from your computer](https://help.shopify.com/manual/using-themes/install-themes#upload-a-theme-from-your-computer).

4.  Edit the `config.yml` to include the theme id of your new theme.

* **theme_id:** the unique id for the theme you want to write to when deploying to this store. You can find this information in the URL of the theme's online editor at Shopify [admin/themes](https://shopify.com/admin/themes). Alternatively, you can use `"live"` as shorthand for the published theme.
  <img src="{{ "/assets/images/theme-id.png" | prepend: site.baseurl }}" alt="Private app credentials" class="demo-image demo-image--app">

5.  Create a private app from your Shopify admin.

* Not sure how to create a private app? Learn how at [Generate credentials in the Shopify admin](https://help.shopify.com/api/getting-started/api-credentials#generate-credentials-in-the-shopify-admin).
* Set the "Theme templates and theme assets" permission to "Read and write".
  <img src="{{ "/assets/images/app-permission.jpg" | prepend: site.baseurl }}" alt="Private app permission requirements" class="demo-image demo-image--app">

6.  Edit the `config.yml` to include the password of your new private app.

* **password:** the password generated via a private app on this store. Access this information on your Shopify [admin/apps/private](https://shopify.com/admin/apps/private) page.
  <img src="{{ "/assets/images/app-credentials.jpg" | prepend: site.baseurl }}" alt="Private app credentials" class="demo-image demo-image--app">
* Note: You can use the same private app password for any `config.yml` environment
  as long as it is for the same store.

7.  From within your new project folder in your command line, use the [Slate commands](#slate-commands) below to build, sync, and watch your local files.

## Slate commands

### Global

* `slate theme [name]` - Generate a new blank theme
* `slate migrate` - Convert an existing theme to work with Slate
* `slate -h` - Options available in your current directory (differs if not in a theme)
* `slate -v` - See your currently installed version of Slate and dependencies

### Theme

* `slate build` — Concatenates JS and SCSS, optimizes SVG icons to be used as snippets, and copies over all other files and folders to a `dist` folder
* `slate deploy` — Builds your `dist` folder and replaces the theme set in config.yml
* `slate watch` — Listens for changes to your local source files and deploys them to your shop
* `slate start` — Runs build, deploy, then watch to get you developing on your shop quickly
* `slate zip` — Builds and compresses your `dist` to a zip file for easy manual upload

> Learn more about [all commands and descriptions](/slate/commands/) or how to [deploy to multiple environments](/slate/commands/#sync-commands).

## Working with Git repositories

A new Slate project comes with a `.gitignore` file. This file is useful if you plan on using Git for version control as it contains a list of files and folders to be ignored when committing to a git repository. Ignored files are both Slate project specific files as well as commonly ignored files on any project.

For more information on `.gitignore` files, see GitHub's documentation: https://help.github.com/articles/ignoring-files/
