const args = process.argv;
const node = Object.getOwnPropertyDescriptor(process.versions, 'node');

beforeAll(() => {
  jest.mock('../createSlateTheme', () => {
    return jest.fn();
  });

  // Mock process.exit since it terminates the test runner
  process.exit = jest.fn(code => {
    throw new Error(`Process exit with code: ${code}`);
  });
});

beforeEach(() => {
  jest.resetModules();
  require('../createSlateTheme').mockClear();
});

test('Calls createSlateTheme with process.argv[2] and, if provided, process.argv[3]', () => {
  const config = require('../config');
  const mockArgs = ['node', 'index.js', 'test-project', 'shopify/test-repo'];
  process.argv = mockArgs;

  require('./../index.js');
  expect(require('../createSlateTheme')).toHaveBeenCalledWith(
    mockArgs[2],
    mockArgs[3],
    config.defaultOptions
  );

  process.argv = args;
});

test('Calls createSlateTheme with the default repo if process.argv[3] is undefined', () => {
  const config = require('../config');
  const mockArgs = ['node', 'index.js', 'test-project'];
  process.argv = mockArgs;

  require('./../index.js');
  expect(require('../createSlateTheme')).toHaveBeenCalledWith(
    mockArgs[2],
    config.defaultStarter,
    config.defaultOptions
  );

  process.argv = args;
});

test('Exits if Node version is lower than 6', () => {
  Object.defineProperty(process.versions, 'node', {
    value: '5.0.0',
  });

  expect(() => {
    require('../index');
  }).toThrow();
  expect(process.exit).toHaveBeenCalled();
  expect(require('../createSlateTheme')).not.toHaveBeenCalled();

  Object.defineProperty(process.versions, 'node', node);
});

test('Exits if a project name is not given as the first argument', () => {
  const mockArgs = ['node', 'index.js'];
  process.argv = mockArgs;

  expect(() => {
    require('./../index.js');
  }).toThrow();
  expect(process.exit).toHaveBeenCalled();
  expect(require('../createSlateTheme')).not.toHaveBeenCalled();

  process.argv = args;
});
