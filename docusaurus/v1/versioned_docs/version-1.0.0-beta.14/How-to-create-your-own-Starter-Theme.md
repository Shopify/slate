---
id: version-1.0.0-beta.14-how-to-create-your-own-starter-theme
title: How to create your own Starter theme
original_id: how-to-create-your-own-starter-theme
---

We understand that not everyone shares the same taste in libraries and solutions as the Shopify Themes team. For cases like this, Slate lets you optionally specify your own Starter Theme. Introduced in Slate v1, starter themes are structured to be used as a starting point whenever creating a new Slate project.

## Getting Started

The easiest way to create your very own starter theme is by customizing an existing one. You can find a list of [community made starter themes](starter-themes#community-starter-themes) in the Slate Wiki, or you can use one of Shopify’s starter themes:

- [Shopify/starter-theme](https://github.com/Shopify/starter-theme)
- [Shopify/skeleton-theme](https://github.com/Shopify/skeleton-theme)

### Starter Theme

[Shopify/starter-theme](https://github.com/Shopify/starter-theme) can help you build a theme using a list of best practices and solutions the Shopify Themes Team has come up with and has applied to the majority of Shopify's free themes. Starter Theme provides a whole range of useful features:

- Templates with minimal structure
- CSS predefined styles and helper classes
- UI interaction with our theme scripts
- Internationalization-ready for multiple languages
- Responsive images that are performant and optimized for any device
- Social meta tags ready to boost your search engine rankings
- Standard sections that are required in order to submit a theme to the Shopify Theme Store

### Skeleton Theme

If you’re someone who likes to develop a theme from scratch, you can take a look at the [Shopify/skeleton-theme](https://github.com/Shopify/skeleton-theme) repository. Skeleton Theme is a barebones theme that gives you the freedom to start a new Slate project with nothing in your way and to customize it however you see fit.

## Create Slate Theme

Whichever starter theme you choose, you can use Create Slate Theme to generate a new Slate project:

```bash
yarn create slate-theme my-new-starter-theme Shopify/starter-theme
```

Where `Shopify/starter-theme` is the name of the repository you wish to use as a starter theme.

## Setting up a repository

After creating your theme, you can create [a repository](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/) using Git version control. The Shopify Themes team works a lot with GitHub and we find it extremely convenient for addressing issues, creating releases and collaborating with one another.

## Connecting to your store and start developing

Before being able to develop your theme, you need [connect to your store](connect-to-your-store). Once this is done, you can [start developing](start-developing)!

### Required files and folders

In order to successfully compile your theme with Slate and upload it to Shopify, you need to ensure the list of mandatory files and folders are there. We encourage you to take a look at [Shopify's required files and folder](slate-themes#9-shopify-required-files-and-folders) to view the complete list of required files and folders.

### Create a GitHub repository

After developing and testing your theme, you are ready to set up [your project on GitHub](https://help.github.com/articles/create-a-repo/) and share it with everyone.

### Start a new project with your new starter theme

Now that your project is hosted on GitHub, anyone can start a Slate theme with it! To do so, type the following into you terminal:

```bash
yarn create slate-theme my-new-theme-project tobi/custom-starter-theme
```

Where `tobi/custom-starter-theme` would reference as {username}/{repository}

## Contributing to the community

Don’t forget to add your new starter theme to the list of community themes on the [Starter Themes page](starter-themes#community-starter-themes) of the Slate Wiki!
