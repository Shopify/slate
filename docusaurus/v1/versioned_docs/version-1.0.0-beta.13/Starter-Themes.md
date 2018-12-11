---
id: version-1.0.0-beta.13-starter-themes
title: Starter Themes
original_id: starter-themes
---

Slate v1 introduces the concept of Starter Themes, a theme that is specifically structured to be used as a starting point for a new project. Ideally, a Starter Theme contains everything a team or individual needs when producing a theme, including solutions to common problems, 3rd party libraries, and helpful reminders.

By default, Slate generates a new project using the [Shopify Starter Theme](https://github.com/Shopify/starter-theme). This theme represents the opinionated and preferred starting point for the Shopify Themes Team.

## Custom Starter Themes

We understand that not everyone shares the same taste in libraries and solutions as the Shopify Themes Team. For cases like this, Slate lets you optionally specify your own Starter Theme. Your Starter Theme can be hosted as Github repo. For example, here is how we specify we want to use [Shopify Skeleton Theme](https://github.com/shopify/skeleton-theme) as our Starter Theme:

```bash
yarn create slate-theme my-new-theme shopify/skeleton-theme
```

A Starter Theme can even just be a folder on your computer. For example, here is how we specify we want to use `my-old-theme` as a Starter Theme:

```bash
yarn create slate-theme my-new-theme my-old-theme/
```

## Community Starter Themes

You can share your customized Starter Theme with the community by publishing your own starter theme to Github. Add a link to your Starter Theme in the list below for others to see!

- [Shopify Skeleton Theme](https://github.com/shopify/skeleton-theme) - A barebones ☠️starter theme with the required files needed to compile with Slate and upload to Shopify.
