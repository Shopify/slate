const args = process.argv;
const node = Object.getOwnPropertyDescriptor(process.versions, 'node');

beforeAll(() => {
  jest.mock('../createSlateTheme', () => {
    return jest.fn();
  });
});

beforeEach(() => {
  jest.resetModules();
  require('../createSlateTheme').mockClear();
});

test('Calls createSlateTheme with process.argv[2] and, if provided, process.argv[3]', () => {
  const mockArgs = ['node', 'index.js', 'test-project', 'shopify/test-repo'];
  process.argv = mockArgs;

  require('./../index.js');
  expect(require('../createSlateTheme')).toHaveBeenCalledWith(
    mockArgs[2],
    mockArgs[3],
  );

  process.argv = args;
});

test('Calls createSlateTheme with the default repo if process.argv[3] is undefined', () => {
  const mockArgs = ['node', 'index.js', 'test-project'];
  const defaultStarter = require('../config').defaultStarter;
  process.argv = mockArgs;

  require('./../index.js');
  expect(require('../createSlateTheme')).toHaveBeenCalledWith(
    mockArgs[2],
    defaultStarter,
  );

  process.argv = args;
});

test('Fails if Node version is lower than 4', () => {
  Object.defineProperty(process.versions, 'node', {
    value: '3.0.0',
  });

  expect(() => {
    require('./../index.js');
  }).toThrow();
  expect(require('../createSlateTheme')).not.toHaveBeenCalled();

  Object.defineProperty(process.versions, 'node', node);
});

test('Fails if a project name is not given as the first argument', () => {
  const mockArgs = ['node', 'index.js'];
  process.argv = mockArgs;

  expect(() => {
    require('./../index.js');
  }).toThrow();
  expect(require('../createSlateTheme')).not.toHaveBeenCalled();

  process.argv = args;
});

test('Fails if the a directory already exists with the project name', () => {
  const mockArgs = ['node', 'index.js', 'test-project'];
  process.argv = mockArgs;

  require('fs-extra').__addMockFiles({
    'test-project/package.json': '{ "name": "test-repo" }',
  });

  expect(() => {
    require('./../index.js');
  }).toThrow();
  expect(require('../createSlateTheme')).not.toHaveBeenCalled();

  process.argv = args;
});
