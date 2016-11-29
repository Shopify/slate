# How to contribute
We ❤️ pull requests. If you'd like to fix a bug, contribute a feature or
just correct a typo, please feel free to do so, as long as you follow
our [Code of Conduct](https://github.com/Shopify/slate/blob/master/CODE_OF_CONDUCT.md).

If you're thinking of adding a big new feature, consider opening an
issue first to discuss it to ensure it aligns to the direction of the
project (and potentially save yourself some time!).

## Getting Started
To start working on the codebase, first fork the repo, then clone it:
```
git clone git@github.com:your-username/slate.git
```
*Note: replace "your-username" with your Github handle*

Install the project's dependencies:
```
npm install
```

Create a config.yml file with private app settings from your shop. See [config-sample.yml](https://github.com/Shopify/slate/blob/master/config-sample.yml) as an example.

Deploy Slate to your shop and start testing your feature.
```
slate deploy
```

## Folder Structure

The following documents the folder structure for this project and what the purpose of each folder is:
```
 +-- docs/ ** API docs that live at https://shopify.github.io/slate
 +-- scripts/ ** Scripts used for development such as deployment and CI scripts
 +-- src/ ** Contains all theme templates and assets
 | +-- assets/
 | +-- config/
 | +-- icons/
 | +-- layout/
 | +-- locales/
 | +-- scripts/
 | +-- sections/
 | +-- snippets/
 | +-- styles/
 | +-- templates/
```

## Documentation
If your change affects how people use the project (i.e. adding or removing
functionality, changing the return value of a function, etc),
please ensure the documentation is also updated to
reflect this. The docs live inside the `docs/` folder and are hosted
at `https://shopify.github.io/slate`.

To run the docs locally, first install the ruby dependencies:
```
bundle install
```
*If you are having troubles setting up jekyll, see https://jekyllrb.com/docs/installation/*

Generate the docs:
```
jekyll serve -s docs
```
If you get a permission error, try `bundle exec jekyll serve -s docs`

The documentation will then be visible at:
`http://127.0.0.1:4000/slate/`
