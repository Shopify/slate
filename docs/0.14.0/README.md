# Slate Docs

## Local Setup

### Install Jekyll via Gemfile
- `bundle install`

*If you are having troubles setting up jekyll, see https://jekyllrb.com/docs/installation/*

### Serve the documentation
- `jekyll serve -s docs`
If you get a permission error, try `bundle exec jekyll serve -s docs`

View locally at [http://127.0.0.1:4000/slate.shopify.com/](http://127.0.0.1:4000/slate.shopify.com/).

## Deployment
Changes to the `docs` directory will automatically be deployed to https://shopify.github.io/slate.shopify.com/ when added to `master` (remote).
