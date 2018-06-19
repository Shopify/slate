import path from 'path';
import fs from 'fs';
import compiler from './helpers/compiler';

describe('slate-cssvar-loader ', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('replaces CSS custom properties with liquid variables', async () => {
    jest.mock('../slate-cssvar-loader.config');
    const stats = await compiler('../fixtures/test.css');
    const output = stats.toJson().modules[0].source;

    const expected = fs.readFileSync(
      path.resolve(__dirname, './fixtures/expected.js'),
      'utf8',
    );
    expect(output).toBe(expected);
  });

  test('loader does not run when disabled', async () => {
    jest.mock('../slate-cssvar-loader.config', () => {
      return {
        cssVarLoaderEnable: false,
      };
    });
    const stats = await compiler('../fixtures/test.css');
    const output = stats.toJson().modules[0].source;

    const expected = fs.readFileSync(
      path.resolve(__dirname, './fixtures/expected-disabled.js'),
      'utf8',
    );
    expect(output).toBe(expected);
  });

  test('loads from multiple css variable liquid files', async () => {
    jest.mock('../slate-cssvar-loader.config', () => {
      const _path = require('path');
      const currentDir = _path.dirname(require.resolve('./index.test.js'));
      return {
        cssVarLoaderEnable: true,
        cssVarLoaderLiquidPath: [
          _path.resolve(currentDir, 'fixtures/css-variables.liquid'),
          _path.resolve(currentDir, 'fixtures/morevars.liquid'),
        ],
      };
    });
    const stats = await compiler('../fixtures/morevars.css');
    const output = stats.toJson().modules[0].source;

    const expected = fs.readFileSync(
      path.resolve(__dirname, './fixtures/expected-morevars.js'),
      'utf8',
    );
    expect(output).toBe(expected);
  });
});
