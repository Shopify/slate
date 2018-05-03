# Contributing Guide

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

1.  See the [Getting Started](https://github.com/Shopify/slate/wiki/Getting-Started) guide on how to get a Slate project up and running.
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

If your change affects how people use the project (i.e. adding or removing functionality, changing the return value of a function, etc), please ensure [the wiki](https://github.com/Shopify/slate/wiki) is also updated to reflect this.

## Changelog

The changelog is updated by the repo's maintainers since a [personal access token](https://github.com/settings/tokens) with repository access is needed to handle GitHub's API call limits.

If this is your first time generating changelog entries, add your personal access token with `public_repo` privileges to the `GITHUB_AUTH` environment variable by adding the following to your `.bashrc` file:

```
# Lerna Changelog Personal Access Token for shopify/slate repo

export GITHUB_AUTH=your_personal_access_token
```

_Note: replace "your_personal_access_token" with your GitHub personal access token_

Run the changelog generator:

```
yarn changelog
```

If nothing appears, you may not have any PRs tagged with appropriate labels in this release or you may have already published those changes. If you just released `v0.12.1` and the previous version was `v0.12.0`, run the following command to get the changes since `v0.12.0`:

```
yarn changelog -- --tag-from=v0.12.0
```

Copy the generated markdown from your terminal into [CHANGELOG.md](https://github.com/Shopify/slate/blob/master/CHANGELOG.md) and add any additional comments you wish to include. If the title of the autogenerated changelog is `Unreleased`, make sure you change it the new version name.

Commit the changes directly to `master` branch, with a commit title of:

```
Changelog vX.X.X
```

_Note: replace "X.X.X" with new repo version number_

Finally, paste the updates you made to the changelog in the release tag notes, see example: [v0.10.0 tag notes](https://github.com/Shopify/slate/releases/tag/v0.10.0).

## Publishing

1.  Merge any changes you want to include in your next release into `master`.

_Note: If you are merging multiple PRs into `master` with a single PR (e.g. you are merging a working branch called v0.11.0 with multiple fixes made from multiple PRs into `master`), then **do not squash and merge this PR** because you will loose valuable details in the auto generated changelog_

2.  Update the [CHANGELOG.md](https://github.com/Shopify/slate/blob/master/CHANGELOG.md) as described above

3.  To select a new version number, and publish packages to NPM, run:

```
yarn run publish
```

_Note: Make sure you are logged into your Shopify NPM account before publishing_

```

```
