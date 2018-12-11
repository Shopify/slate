---
id: version-1.0.0-beta.13-local-development
title: Local development
original_id: local-development
---

Local development in Shopify Themes is pretty unique, and probably unlike anything you've previously encountered. In fact, with Slate local development you're still deploying and viewing pages from Shopify servers, so technically it's not _really_ local development. Let's explore why Slate takes this approach, and what makes local development in Shopify unique.

## Developing with Shopify Liquid

Liquid is a templating language created by Shopify and written in Ruby. It is now available as an [open source project](https://github.com/Shopify/liquid) on GitHub, and used by many different software projects and companies. Liquid is the backbone of all Shopify themes, and is used to load dynamic content to the pages of online stores.

Shopify Themes use [an extended version of Liquid](https://help.shopify.com/themes/liquid) with a variety of additional objects, tags, and filters. These extensions make it possible for Shopify Theme Liquid to access and manipulate a huge amount of store data, including products, a user's cart, Theme Editor settings, etc.

Rendering Shopify Liquid locally on a developers machine (in a reliable, sustainable manner) is currently not possible due to the following realities:

1. The code for all Shopify Liquid features is written in Ruby and is tightly coupled to our databases and servers. In its current state, it would be extremely difficult for us to package this code as an independent library and share it without exposing Shopify's private internal workings.

2. Shopify Liquid is extended as we release new features, which means it is constantly changing. If we had a separate, local-development Shopify Liquid renderer, we would need to duplicate any new logic which means twice as much work and more potential for error.

Because it is currently not possible to render Shopify Liquid locally in a reliable manner, Slate relies on Shopify servers to do the work so you can preview your changes as you develop. **This means that any changes you make while developing with Slate will be deployed to the theme you have specified**.

We realize that that deploying to Shopify servers introduces a level of risk while developing, such as possibly overwriting files on your live theme or erasing Theme Editor customizations.

Luckily, Slate comes with a few handy features which help reduce these risks as well as improve the experience of developing with a external server.

## Prompt if deploying to published theme

Slate uses [deploy environments](deploy-environments) to specify which store and theme it should be deploying files too. If you are about to deploy to your store's [currently published theme](https://help.shopify.com/manual/using-themes/organizing-themes/publishing-themes), Slate will prompt you before continuing.

## Prompt if deploying settings_data.json

The settings_data.json file is used to keep track of any changes you've made to your theme in the Shopify Theme Editor. It is not uncommon for the `settings_data.json` file in your Slate project to become out of sync with the `setting_data.json` file on your store. When this happens and you deploy your Slate project, your store's `settings_data.json` will be overwritten with the version inside your Slate project. This can result in losing changes you've made in the Theme Editor.

Slate will detect if you are about to upload `settings_data.json`, and prompt you to confirm your action and the potential for overwriting out-of-sync changes.

## Local development server

Slate v1.0 introduces a local server which compiles and serves theme JavaScript and CSS locally. By serving these assets locally, developers don't need to wait for them to be uploaded to Shopify servers to preview the changes they are making. When combined with Hot Module Reloading, developers see changes in their code reflected almost instantly.

Developers wanting to share an instance of their store with other developers are often confused when they see their store appear broken. Because CSS and JavaScript are being served locally, your theme won’t function on any machine other than the one the Express server is currently running on.
