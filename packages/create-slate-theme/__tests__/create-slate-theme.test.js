const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const createSlateTheme = require('../create-slate-theme');
const config = require('../create-slate-theme.config');
const {splitCommandString} = require('../utils');

const TEST_PROJECT = 'test-project';
const TEST_STARTER = 'test-repo';
const TEST_COMMITTISH = '123456';
const CLONE_HTTPS_COMMAND = `git clone
  https://github.com/shopify/${TEST_STARTER}
  "${path.resolve(TEST_PROJECT)}"
  --single-branch`;
const CLONE_SSH_COMMAND = `git clone
  git@github.com:shopify/${TEST_STARTER}.git
  "${path.resolve(TEST_PROJECT)}"
  --single-branch`;
const CLONE_BRANCH_COMMAND = `git clone
  -b ${TEST_COMMITTISH}
  https://github.com/shopify/${TEST_STARTER}
  "${path.resolve(TEST_PROJECT)}"
  --single-branch`;

jest.mock('@shopify/slate-env', () => {
  return {create: jest.fn()};
});

beforeAll(() => {
  // Mock process.exit since it terminates the test runner
  process.exit = jest.fn((code) => {
    throw new Error(`Process exit with code: ${code}`);
  });
});

beforeEach(() => {
  fs.__resetMockFiles();
  execa().mockClear();
});

test('can clone a theme from a Git repo using HTTPS', async () => {
  const [file, ...args] = splitCommandString(CLONE_HTTPS_COMMAND);

  await createSlateTheme('test-project', 'shopify/test-repo');

  expect(fs.existsSync('test-project/package.json')).toBeTruthy();
  expect(execa()).toHaveBeenCalledWith(file, args, {stdio: 'pipe'});
});

test('can clone a theme from a Git repo using SSH', async () => {
  const [file, ...args] = splitCommandString(CLONE_SSH_COMMAND);

  await createSlateTheme('test-project', 'shopify/test-repo', {ssh: true});

  expect(fs.existsSync('test-project/package.json')).toBeTruthy();
  expect(execa()).toHaveBeenCalledWith(file, args, {stdio: 'pipe'});
});

test('can clone a theme from a Github repo with a specified commitish (branch)', async () => {
  const [file, ...args] = splitCommandString(CLONE_BRANCH_COMMAND);

  await createSlateTheme('test-project', 'shopify/test-repo#123456');

  expect(fs.existsSync('test-project/package.json')).toBeTruthy();
  expect(execa()).toHaveBeenCalledWith(file, args, {stdio: 'pipe'});
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

test('can skip installing theme dependencies', async () => {
  await createSlateTheme(
    'test-project',
    'shopify/test-repo',
    Object.assign({}, config.defaultOptions, {skipInstall: true}),
  );
  expect(execa()).not.toHaveBeenCalledWith('yarnpkg', [], {stdio: 'inherit'});
  expect(execa()).not.toHaveBeenCalledWith('npm', ['install'], {
    stdio: 'inherit',
  });
});

test('fails if theme name does not adhere to NPM naming restrictions', async () => {
  await expect(
    createSlateTheme('test project', config.defaultStarter),
  ).rejects.toBeInstanceOf(Error);
  expect(process.exit).toHaveBeenCalled();
});

test('fails if the a conflicting file already exists in the theme directory', async () => {
  require('fs-extra').__addMockFiles({
    'test-project/package.json': '{ "name": "test-repo" }',
  });

  await expect(
    createSlateTheme('test-project', config.defaultStarter),
  ).rejects.toBeInstanceOf(Error);
  expect(process.exit).toHaveBeenCalled();
});

test('throws an error when copying from a local directory that does not exist', async () => {
  await expect(
    createSlateTheme('test-project', 'old-project'),
  ).rejects.toBeInstanceOf(Error);
});

test('throws an error if a project already exists', () => {
  fs.__addMockFiles({
    'test-project/package.json': '{ "name": "test-repo" }',
  });

  expect(
    createSlateTheme('test-project', 'shopify/test-repo'),
  ).rejects.toBeInstanceOf(Error);
});
