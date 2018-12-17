---
id: version-1.0.0-beta.14-how-to-update-Slate-to-the-latest-version
title: How to update Slate to the latest version
original_id: how-to-update-Slate-to-the-latest-version
---

Slate is currently in beta and is undergoing heavy development, which makes the release cycle much more frequent. You will want to ensure you are running the latest version of Slate in your Shopify theme by updating the `@shopify/slate-tools` dependency over time.

## Updating Slate version

To update `@shopify/slate-tools`, we recommend using either [yarn upgrade](https://yarnpkg.com/lang/en/docs/cli/upgrade/) or [npm install](https://docs.npmjs.com/cli/install):

`yarn upgrade --latest @shopify/slate-tools`

or

`npm install @shopify/slate-tools@latest`

In addition to updating the dependency inside of the `node_modules` folder, this command also updates the version of `@shopify/slate-tools` in your `package.json` file.

> Note: to better understand the updates that are made to Slate, you can check out the [Slate changelog](https://github.com/Shopify/slate/releases) to view the list of updates for each release.
