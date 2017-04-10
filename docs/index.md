---
layout: default
---

# Slate

Slate is a theme scaffold and command line tool for developing Shopify themes. It is designed to assist your development workflow and speed up the process of developing, testing, and deploying themes to Shopify stores.

Slate allows you to sync local files with your live shop, deploy to multiple environments at the same time, and organize stylesheets and scripts in a flexible way.

## Getting started

<blockquote>
  <a href="https://nodejs.org/en/">Node</a> 4+ is supported, but 6+ is recommended to fully benefit from Slate. If you want the template files without the build tools, <a href="https://sdks.shopifycdn.com/slate/latest/slate-src.zip" data-ga-track="slateZip">get the latest zip here</a>.
</blockquote>

1. Install Slate with `npm install -g @shopify/slate`.
2. Create a new theme with `slate theme theme-name`, where `theme-name` will be a newly created folder. If you already have a theme locally, you can use the `slate migrate` command and [follow these steps](/slate/commands/#migrate) instead.
3. Create a private app on your development store(s).
  * Not sure how to create a private app? [Learn how here](https://help.shopify.com/api/guides/api-credentials#get-credentials-through-the-shopify-admin).
  * Set the "Theme templates and theme assets" permission to "Read and write".
  <img src="{{ "/assets/images/app-permission.jpg" | prepend: site.baseurl }}" alt="Private app permission requirements" class="demo-image demo-image--app">
4. Rename `config-sample.yml` to `config.yml` and add your private app credentials.
  * **store:** the Shopify-specific URL for this store/environment (ie. my-store.myshopify.com)
  * **theme_id:** the unique id for the theme you want to write to when deploying to this store. You can find this information in the URL of the theme's online editor at Shopify [admin/themes](https://shopify.com/admin/themes). Alternatively, you can use `"live"` for the published theme.
  <img src="{{ "/assets/images/theme-id.png" | prepend: site.baseurl }}" alt="Private app credentials" class="demo-image demo-image--app">
  * **password:** the password generated via a private app on this store.  Access this information on your Shopify [admin/apps/private](https://shopify.com/admin/apps/private) page.
  <img src="{{ "/assets/images/app-credentials.jpg" | prepend: site.baseurl }}" alt="Private app credentials" class="demo-image demo-image--app">
5. From within your new project folder in your command line, use the commands below to build, sync, and watch your local files.

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
