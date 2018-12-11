---
id: version-1.0.0-beta.13-create-slate-theme
title: Create Slate Theme
original_id: create-slate-theme
---

The `create-slate-theme` package allows you to create a new Slate project with a single command. We recommend using either [`yarn create`](https://yarnpkg.com/lang/en/docs/cli/create/) or [`npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) to create a new Slate project.

## Usage

```bash
yarn create slate-theme my-new-theme
```

or

```bash
npx create-slate-theme my-new-theme
```

> **Note**: If you prefer to use NPM, you will need to install `create-slate-theme` globally before creating a new project:
>
> ```bash
> npm install -g create-slate-theme
> create-slate-theme my-new-theme
> ```

### Options

| Options         | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `--skipInstall` | Skips installing theme dependencies which greatly speeds up overall setup time. |
| `--ssh`         | Uses SSH, instead of HTTPS, when cloning a theme to your local directory.       |

## Custom starting point

The default Slate theme is generated from [`Shopify/starter-theme`](https://github.com/Shopify/starter-theme); Shopify's opinionated starting point for developing Shopify themes. However, you're not forced to create a new project with Shopify's Starter Theme!

Instead, you can reference your own Github repository or local directory starting point.

### Repository

To create a new theme from a GitHub repository simply pass the `{username}/{repository}`:

```bash
yarn create slate-theme my-new-theme shopify/skeleton-theme
```

### Local directory

If you want to create a theme based on a local directory, reference the path:

```bash
yarn create slate-theme my-new-theme my-own-starter-theme/
```

## Contributing your own starter theme

You can share your starting point with the community by publishing your own starter theme to Github.

For example, Thomas thinks his starter theme is way more clever than Shopify's Starter Theme. So he creates his own, pushes it to a GitHub repository and calls the following command for any of his future Slate projects:

```bash
yarn create slate-theme my-new-theme thomas/way-more-clever-starter-theme
```

See [custom starter themes](starter-themes) for more information on how you can generate a new project from other sources and even contribute your very own to the Slate community!
