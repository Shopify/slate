const compiler = require('./helpers/compiler');
const path = require('path');

jest.unmock('fs-extra');
test('normal structure', async () => {
  const stats = await compiler('fixtures/normalsections/');

  // Check if file has been added to assets so webpack can output it
  debugger;
  expect(
    stats.compilation.assets['../sections/test-section.liquid'],
  ).toMatchSnapshot();

  // Check if file gets written to the output file system at the correct location, and with the correct values
  expect(
    stats.compilation.compiler.outputFileSystem
      .readFileSync(
        path.resolve(__dirname, 'dist', 'sections', 'test-section.liquid'),
      )
      .toString(),
  ).toMatchSnapshot();
});
