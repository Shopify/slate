const args = process.argv;
const node = Object.getOwnPropertyDescriptor(process.versions, 'node');

beforeAll(() => {
  jest.mock('../create-slate-theme', () => {
    return jest.fn();
  });

  // Mock process.exit since it terminates the test runner
  process.exit = jest.fn((code) => {
    throw new Error(`Process exit with code: ${code}`);
  });
});

beforeEach(() => {
  jest.resetModules();
  require('../create-slate-theme').mockClear();
});

test('Calls createSlateTheme with process.argv[2] and, if provided, process.argv[3]', () => {
  const config = require('../create-slate-theme.config');
  const mockArgs = ['node', 'index.js', 'test-project', 'shopify/test-repo'];
  process.argv = mockArgs;

  require('./../index.js');
  expect(require('../create-slate-theme')).toHaveBeenCalledWith(
    mockArgs[2],
    mockArgs[3],
    config.defaultOptions,
  );

  process.argv = args;
});

test('Calls createSlateTheme with the default repo if process.argv[3] is undefined', () => {
  const config = require('../create-slate-theme.config');
  const mockArgs = ['node', 'index.js', 'test-project'];
  process.argv = mockArgs;

  require('./../index.js');
  expect(require('../create-slate-theme')).toHaveBeenCalledWith(
    mockArgs[2],
    config.defaultStarter,
    config.defaultOptions,
  );

  process.argv = args;
});

test('Registers an --ssh flag and passes it to Create Slate Theme', () => {
  const config = Object.assign({}, require('../create-slate-theme.config'));
  const mockArgs = ['node', 'index.js', 'test-project', '--ssh'];

  config.defaultOptions = Object.assign({}, config.defaultOptions, {ssh: true});
  process.argv = mockArgs;

  require('./../index.js');
  expect(require('../create-slate-theme')).toHaveBeenCalledWith(
    mockArgs[2],
    config.defaultStarter,
    config.defaultOptions,
  );
});

test('Exits if Node version is lower than 8.9.4', () => {
  Object.defineProperty(process.versions, 'node', {
    value: '8.9.3',
  });

  expect(() => {
    require('../index');
  }).toThrow();
  expect(process.exit).toHaveBeenCalled();
  expect(require('../create-slate-theme')).not.toHaveBeenCalled();

  Object.defineProperty(process.versions, 'node', node);
});

test('Exits if a project name is not given as the first argument', () => {
  const mockArgs = ['node', 'index.js'];
  process.argv = mockArgs;

  expect(() => {
    require('./../index.js');
  }).toThrow();
  expect(process.exit).toHaveBeenCalled();
  expect(require('../create-slate-theme')).not.toHaveBeenCalled();

  process.argv = args;
});
