import path from 'path';
import fs from 'fs';
import compiler from './helpers/compiler';

describe('slate-cssvar-loader ', () => {
  beforeEach(() => {
    jest.resetModules();
    global.slateUserConfig = {};
  });

  test('replaces CSS custom properties with liquid variables', async () => {
    global.slateUserConfig['cssVarLoader.liquidPath'] = [
      path.resolve(__dirname, './fixtures/css-variables.liquid'),
    ];

    const stats = await compiler('../fixtures/test.css');
    const output = stats.toJson().modules[0].source;

    const expected = fs.readFileSync(
      path.resolve(__dirname, './fixtures/expected.js'),
      'utf8',
    );
    expect(output).toBe(expected);
  });

  test('loader does not run when disabled', async () => {
    global.slateUserConfig['cssVarLoader.enable'] = false;

    const stats = await compiler('../fixtures/test.css');
    const output = stats.toJson().modules[0].source;

    const expected = fs.readFileSync(
      path.resolve(__dirname, './fixtures/expected-disabled.js'),
      'utf8',
    );
    expect(output).toBe(expected);
  });

  test('loads from multiple css variable liquid files', async () => {
    global.slateUserConfig['cssVarLoader.liquidPath'] = [
      path.resolve(__dirname, 'fixtures/css-variables.liquid'),
      path.resolve(__dirname, 'fixtures/morevars.liquid'),
    ];
    const stats = await compiler('../fixtures/morevars.css');
    const output = stats.toJson().modules[0].source;

    const expected = fs.readFileSync(
      path.resolve(__dirname, './fixtures/expected-morevars.js'),
      'utf8',
    );
    expect(output).toBe(expected);
  });
});
