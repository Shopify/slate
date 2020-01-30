# Contributing Guide

## This repo is no longer active. See README for details

Slate is an open-source project built for the Shopify Theme community and it needs contributions from the community to be truly successful. We encourage you to join us in our mission of enhancing the Shopify theme development experience!

## Scope

The Slate Github repo exists for the theme development community to discuss and solve problems directly related to Slate. It **is not the place** to discuss general theme development problems, nor the place to seek help for non-Slate related problems.

Shopify Theme development is a big topic and it's completely normal that you will encounter problems which might require you to reach out for help. In fact, we provide several knowledge and support platforms for theme development:

* [The Shopify Help Center](https://help.shopify.com/themes)
* [The Partners Blog](https://www.shopify.ca/partners/blog/topics/shopify-theme-development)
* [Shopify Forum](https://ecommerce.shopify.com/forums)
* [Shopify Experts](https://experts.shopify.com/)
* [Shopify Support](https://help.shopify.com/questions)

## How to contribute

If you encounter a bug, think of a useful feature, or find something confusing in the docs, please [create a new issue](https://github.com/Shopify/slate/issues/new)!

We ❤️ pull requests. If you'd like to fix a bug, contribute to a feature or just correct a typo, please feel free to do so, as long as you follow our [Code of Conduct](https://github.com/Shopify/slate/blob/master/CODE_OF_CONDUCT.md).

If you're thinking of adding a big new feature, consider opening an issue first to discuss it to ensure it aligns to the direction of the project (and potentially save yourself some time!).

This repo is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) consisting of multiple packages and is managed using [Lerna](https://github.com/lerna/lerna).

## Getting Started

To start working on the codebase:

#### 1. Fork the repo, then clone it:

```
git clone git@github.com:your-username/slate.git
```

_Note: replace "your-username" with your GitHub handle_

#### 2. Install all package dependencies and link local packages:

```
yarn bootstrap
```

This command will install project dependencies and make sure any references to Slate packages use the local versions of those packages instead of the version hosted on NPM. For example, in the `package.json` of `@shopify/slate-tools`, there is a dependency `@shopify/slate-env`. Instead of downloading `@shopify/slate-env` from NPM, we link to the copy found in the `packages/slate-env` folder.

#### 3. Make some changes and write some tests for those changes. Run the tests with:

```
yarn test
```

#### 4. If your tests pass, commit your changes:

```
git commit -a -m="Your commit message"
```

#### 5. Push your commit to your Github fork:

```
git push origin master
```

#### 6. Open a Pull Request

See [Github's official documentation](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) for more details.

## How to run your local edits to `create-slate-theme`

Create Slate Theme is typically run via `yarn create slate-theme`, however this command always pulls the latest version of `create-slate-theme` from NPM so you can't use it to test any changes you make locally.

To run your local version of `create-slate-theme`, do the following:

1.  In your terminal, navigate to the `packages/create-slate-theme` folder in the Slate Repo
2.  Run `node index.js <your-theme-name> [custom-theme]`. The last two arguments are the same as when you would use when using `yarn create`

## View changes to `slate-tools` package in a live store

In order to test changes you make to Slate Tools, you'll need to have a Slate theme project to test it with. To do this:

1.  See the [Getting Started](https://shopify.github.io/slate/docs/system-requirements) guide on how to get a Slate project up and running.
2.  In your terminal, go to `packages/slate-tools` directory in your forked version of the Slate repo (not in the node_modules folder of your theme project)

```
cd packages/slate-tools
```

3.  Create a link to your local Slate Tools project that has changes:

```
yarn link
```

4.  Now in your theme project, type the following to complete the link to your local Slate Tools project:

```
yarn link @shopify/slate-tools
```

That's it! Now when you run any Slate Tools commands, they should be run using your local version of Slate Tools and not the version downloaded from NPM.

## Documentation

If your change affects how people use the project (i.e. adding or removing functionality, changing the return value of a function, etc), please ensure [the documentation website](https://shopify.github.io/slate/docs/about) is also updated to reflect this.

The documentation website lives in the [docs folder](https://github.com/Shopify/slate/tree/master/docs) on the `master` branch and is hosted using GitHub Pages on the `gh-pages` branch.

You only need to update the source files and Travis CI will take care of deploying the changes when your Pull Request is merged into the `master` branch.

You can read both the README files in the [v0 folder](https://github.com/Shopify/slate/tree/master/docs/v0) and the [v1 folder](https://github.com/Shopify/slate/tree/master/docs/v0) to see how to run the documentation site locally. 

## Publishing

### New NPM package

⚠️ Note: If there is a new NPM package in the new release, you need to manually publish the new package first.

1. Login into your NPM account (Your account must be under Shopify Org)
   ```
   npm login
   ```
2. Make sure the new package has Shopify org scope and publish config in `package.json`
   ```
   {
      "name": "@shopify/<new-package-name>",
      ..
      "publishConfig": {
        "access": "public",
        "@shopify:registry": "https://registry.npmjs.org"
      }
   }
   ```
3. Run NPM publish (Make sure you are in the new package folder)
   ```
   slate/packages/<new-package-name> $ npm publish
   ```
   If you are getting permission errors, open `.npmrc` and comment out the following line:
   ```
   @shopify:registry=...
   ```

### Auto-Deploy setup

⚠️ Note: You must have a Shopify Okta account in order to login to Shipit and publish.

1. Merge any changes you want to include in your next release into `master`.

   _Note: If you are merging multiple PRs into `master` with a single PR (e.g. you are merging a working branch called v0.11.0 with multiple fixes made from multiple PRs into `master`), then **do not squash and merge this PR** because you will loose valuable details in the commit history_

2. Checkout `master` and pull the latest from the origin

   ```
   slate $ git checkout master && git pull origin master
   ```

3. You can verify that there are indeed packages to be published (optional)

   ```
   slate $ yarn lerna changed
   ...
   lerna notice cli v3.11.0
   lerna info Looking for changed packages since v1.0.0-beta.17
   @shopify/slate-sections-plugin
   @shopify/slate-tools
   lerna success found 2 packages ready to publish
   ✨  Done in 1.39s.
   ```

4. Run the release step to choose the version bump desired

   ```
   slate $ yarn release
   ...
   lerna notice cli v3.11.0
   lerna info current version 1.0.0-beta.17
   lerna info Looking for changed packages since v1.0.0-beta.17
   ? Select a new version (currently 1.0.0-beta.17) (Use arrow keys)
     Patch (1.0.0)
     Minor (1.0.0)
     Major (1.0.0)
     Prepatch (1.0.1-alpha.0)
     Preminor (1.1.0-alpha.0)
     Premajor (2.0.0-alpha.0)
     Custom Prerelease
   ❯ Custom Version
   ? Enter a custom version 1.0.0-beta.18

   Changes:
    - @shopify/slate-sections-plugin: 1.0.0-beta.17 => 1.0.0-beta.18
    - @shopify/slate-tools: 1.0.0-beta.17 => 1.0.0-beta.18

   ? Are you sure you want to create these versions? (ynH)
   ```

   This command will:

   1. Run the equivalent of lerna updated to determine which packages need to be published.
   2. If necessary, increment the version key in lerna.json.
   3. Update the package.json of all updated packages to their new versions.
   4. Update all dependencies of the updated packages with the new versions, specified with a caret (^).
   5. Create a new git commit and tag for the new version.
   6. Git push to origin master with the newly created tag.

   _Note: See the [lerna documentation](https://github.com/lerna/lerna/releases?after=v3.1.3) for more information_

5. Login to [Shipit](https://shipit.shopify.io/shopify/slate/production)
6. In the Undeployed Commits list, identify the commit with the name of the version that was created in step #4, wait for CI to be 🍏, click the 'Deploy' button to publish to npm's public registry.
