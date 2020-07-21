---
id: version-1.0.0-beta.14-about
title: Slate - End of Support (January 2020)
original_id: about
---

After re-evaluating Slate and its current state, Shopify has decided to officially end support for Slate.

### Why?

With the launch of our new [section theme architecture](https://help.shopify.com/en/themes/development/sections-architecture) we're taking a step back to examine our current tooling and how we can deliver the best theming experience to our theme developers. 

Slate is not in line with our vision for themes moving forward and it does not solve two of the larger asks our theme developers have made:

* Local development of a Shopify theme
* Support for code versioning within themes

### I’m a theme developer that is using Slate. What should I do now?

Slate was built upon [Theme Kit](https://github.com/Shopify/themekit) as an opinionated way to setup up a Shopify theme build. Shopify will continue to actively maintain and support the growth of Theme Kit through the open-source community.

You can continue using Slate the way you have been. While we will not be maintaining it any longer, you can still fork the repo to suit your own needs.

<hr />

## About

Slate is a command line tool for developing Shopify Themes. It is designed to assist your development workflow and speed up the process of developing, testing, and deploying themes to Shopify.

🚀 [Get started with a new Slate project](create-a-new-slate-project)

## Mission

Slate empowers developers of all skill levels to build quality Shopify themes. Slate guides developers by providing a tested workflow and opinionated development toolkit, while also accommodating more established developers through advanced configuration.

## Features

- Dependency management via [Webpack](https://webpack.js.org/)
- ES6+ support via [Babel](https://babeljs.io/)
- [Local development asset server](local-development)
- [Local SASS compilation](styles-with-liquid#liquid-with-css-custom-properties)
- [Starter Themes](starter-themes)
- [Deploy Environments](deploy-environments)
- [Safe watch and deploy](local-development#prompt-if-deploying-to-published-theme)
- [Asset minification](asset-minification)
- [Configuration via slate.config.js](slate-configuration)

## Contributing

For help on setting up the repo locally, building, testing, and contributing
please see [CONTRIBUTING.md](https://github.com/Shopify/slate/blob/master/CONTRIBUTING.md).
