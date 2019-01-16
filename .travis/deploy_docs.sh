#!/bin/bash

set -e # exit with nonzero exit code if anything fails

build_v0() {
  echo "Building v0 docs"
  cd docs && cd v0 && bundle install && bundle exec jekyll build
  cd .. && cd ..
}

build_v1() {
  echo "Building v1 docs"
  cd docs && cd v1 && npm install && npm run build
  cd .. && cd ..
}

setup_repo() {
  git config --global user.email "slate@shopify.com"
  git config --global user.name "Slate bot"

  cd $HOME
  git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/Shopify/slate.git gh-pages > /dev/null
}

copy_files() {
  cp -a build/Shopify/slate/docs/v1/build/slate/. gh-pages
  cp -a build/Shopify/slate/docs/v0/_site/. gh-pages/docs/0.14.0
}

commit_files() {
  cd gh-pages
  git add -A
  git commit -m "Travis build $TRAVIS_BUILD_NUMBER"
  git push -fq origin gh-pages > /dev/null
}

MODIFIED_DOCS_FILES=($(git diff --name-only $TRAVIS_COMMIT_RANGE | grep -E '(^docs)'))

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" && $MODIFIED_DOCS_FILES != "" ]]; then

build_v0
build_v1
setup_repo
copy_files
commit_files

echo "Done updating gh-pages"
fi;

