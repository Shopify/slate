const path = require('path');
const compiler = require('./helpers/compiler');

jest.unmock('fs-extra');

test('sections with no seperate schemas, with liquid files that just need to be copied over', async () => {
  const stats = await compiler('fixtures/startersections/');
  expect(stats.compilation.assets).toMatchSnapshot();

  const outputFiles = stats.compilation.compiler.outputFileSystem.readdirSync(
    path.resolve(__dirname, 'dist', 'sections'),
  );
  outputFiles.forEach((file) => {
    expect(
      stats.compilation.compiler.outputFileSystem.readFileSync(
        path.resolve(__dirname, 'dist', 'sections', file),
        'utf-8',
      ),
    ).toMatchSnapshot();
  });
});

test('sections that have templates living in folders with a schema.json and potentially locales to go with aswell', async () => {
  const stats = await compiler('fixtures/normalsections/');
  // Check if file has been added to assets so webpack can output it
  expect(
    stats.compilation.assets['../sections/test-section.liquid'].children[0]
      ._value,
  ).toMatchSnapshot();

  // Check if file gets written to the output file system at the correct location, and with the correct values
  expect(
    stats.compilation.compiler.outputFileSystem.readFileSync(
      path.resolve(__dirname, 'dist', 'sections', 'test-section.liquid'),
      'utf-8',
    ),
  ).toMatchSnapshot();
});
