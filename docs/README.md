# Slate Docs

## Local Setup

### Install Jekyll via Gemfile
- `bundle install`

*If you are having troubles setting up jekyll, see https://jekyllrb.com/docs/installation/*

### Serve the documentation
- `jekyll serve -s docs`
If you get a permission error, try `bundle exec jekyll serve -s docs`

## Deployment
Changes to the `docs` directory will automatically be deployed to http://shopify.github.io/docs/ when added to `master` (remote).
