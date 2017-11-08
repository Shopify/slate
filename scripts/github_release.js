const path = require('path');
const GitHubApi = require('github');

const ZIP_DIR = '/packages/slate-theme/upload';

const github = new GitHubApi({
  debug: true,
  Promise: require('promise'),
  timeout: 5000,
  host: 'api.github.com',
  protocol: 'https',
});

github.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN,
});

github.repos.uploadAsset({
  owner: 'shopify',
  repo: 'slate',
  id: process.env.CIRCLE_TAG,
  filePath: path.join(ZIP_DIR, 'slate-theme.zip'),
  name: 'slate-theme.zip',
});

github.repos.uploadAsset({
  owner: process.env.CIRCLE_PROJECT_USERNAME,
  repo: process.env.CIRCLE_PROJECT_REPONAME,
  id: process.env.CIRCLE_TAG,
  filePath: path.join(ZIP_DIR, 'slate-src.zip'),
  name: 'slate-src.zip',
});
