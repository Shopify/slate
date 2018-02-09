# Create Slate Theme

Start a new Slate project with a single command. Defaults to creating a fresh copy of [`Shopify/starter-theme`](https://github.com/Shopify/starter-theme):

## Getting Started

To get started with a new project, run the following command in your terminal:

```
yarn create slate-theme my-new-theme
```

or if you prefer NPM

```
npm install -g create-slate-theme
create-slate-theme my-new-theme
```

## Custom Starting Points

Instead of using [shopify/starter-theme](https://github.com/Shopify/starter-theme), you can optionally specify your own Github repo or local folder to copy as a starting point:

```
yarn create slate-theme my-new-theme shopify/skeleton-theme
```

or

```
yarn create slate-theme my-new-theme my-old-theme/
```

You can share your starting point with the community by publishing your own starter theme to Github. For example, I could publish my own starter theme in the t-kelly/custom-starter-theme repo and then start a new project with it by calling:

```
yarn create slate-theme my-new-theme t-kelly/custom-starter-theme
```

## Options

#### --skipInstall

Skips installing theme dependencies which greatly speeds up overall setup time.
