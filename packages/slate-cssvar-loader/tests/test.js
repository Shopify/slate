import path from 'path';
import fs from 'fs';
import compiler from './compiler';

test('Replaces CSS custom properties with liquid variables', async () => {
  const stats = await compiler(
    './files/test.css',
    {cssVariablesPath: path.resolve(__dirname, './files/css-variables.liquid')},
  );
  const output = stats.toJson().modules[0].source;

  const expected = fs.readFileSync(path.resolve(__dirname, './files/expected.js'), 'utf8');
  expect(output).toBe(expected);
});

test('Missing liquid variable', async () => {
  const stats = await compiler(
    './files/invalid.css',
    {cssVariablesPath: path.resolve(__dirname, './files/css-variables.liquid')},
  );
  const output = stats.toJson().modules[0].source;

  expect(output).toBe('throw new Error(\"Module build failed: Liquid variable not found for CSS variable INVALID\");');
});
