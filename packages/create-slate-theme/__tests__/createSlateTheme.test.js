const fs = require('fs-extra');
const execa = require('execa');
const createSlateTheme = require('../createSlateTheme');
const config = require('../config');

const CLONE_COMMAND =
  'git clone git@github.com:shopify/test-repo.git test-project --single-branch';
const CLONE_BRANCH_COMMAND =
  'git clone -b 123456 git@github.com:shopify/test-repo.git test-project --single-branch';

beforeEach(() => {
  fs.__resetMockFiles();
  execa().mockClear();
});

test('can clone a theme from a Github repo', async () => {
  const [file, ...args] = CLONE_COMMAND.split(/\s+/);

  await createSlateTheme('test-project', 'shopify/test-repo');

  expect(fs.existsSync('test-project/package.json')).toBeTruthy();
  expect(execa()).toHaveBeenCalledWith(file, args, {stdio: 'inherit'});
});

test('can clone a theme from a Github repo with a specified commitish (branch)', async () => {
  const [file, ...args] = CLONE_BRANCH_COMMAND.split(/\s+/);

  await createSlateTheme('test-project', 'shopify/test-repo#123456');

  expect(fs.existsSync('test-project/package.json')).toBeTruthy();
  expect(execa()).toHaveBeenCalledWith(file, args, {stdio: 'inherit'});
});

test('can copy a theme from a local directory', async () => {
  fs.__addMockFiles({
    'old-project/package.json': '{ "name": "test-repo" }',
    'old-project/node_modules/some-package/index.js': '',
    'old-project/.git/index': '',
  });

  await createSlateTheme('test-project', 'old-project');
  expect(fs.existsSync('test-project/package.json')).toBeTruthy();
  expect(
    fs.existsSync('test-project/node_modules/some-package/index.js'),
  ).toBeFalsy();
  expect(fs.existsSync('test-project/.git/index')).toBeFalsy();
});

test('installs theme dependencies after cloning or copying', async () => {
  await createSlateTheme('test-project', 'shopify/test-repo');
  expect(execa()).toHaveBeenCalledWith('yarnpkg', [], {stdio: 'inherit'});
});

test('copys shopify.yml to the config directory', async () => {
  await createSlateTheme('test-project', 'shopify/test-repo');
  expect(() => {
    jest.requireActual('fs-extra').existsSync(config.shopifyConfig.src);
  }).toBeTruthy();
  expect(fs.existsSync('test-project/config/shopify.yml')).toBeTruthy();
});

test('throws an error when copying from a local directory that does not exist', async () => {
  await expect(() => {
    return createSlateTheme('test-project', 'old-project');
  }).toThrow();
});

test('throws an error if a project already exists', async () => {
  fs.__addMockFiles({
    'test-project/package.json': '{ "name": "test-repo" }',
  });

  expect(() => {
    return createSlateTheme('test-project', 'shopify/test-repo');
  }).toThrow();
});
