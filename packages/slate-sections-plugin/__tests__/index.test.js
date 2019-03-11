/* eslint-disable no-new */
const path = require('path');
const compiler = require('./helpers/compiler');
const SlateSectionsPlugin = require('./../');

jest.unmock('fs-extra');

test('sections with no seperate schemas, with liquid files that just need to be copied over', async () => {
  const stats = await compiler('fixtures/startersections/');
  const expectedAssetOutputKey = '../sections/test-section.liquid';

  debugger;
  // Ensure sections is in context
  expect(
    stats.compilation.contextDependencies.has(
      path.resolve(__dirname, 'fixtures/startersections/sections'),
    ),
  ).toBeTruthy();

  expect(
    stats.compilation.assets[expectedAssetOutputKey]._value,
  ).toMatchSnapshot();

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

test('section that has template living in folders with schema.json and no locales', async () => {
  const stats = await compiler('fixtures/seperatejsonsections/');
  const expectedAssetOutputKey = '../sections/test-section.liquid';

  // Ensure sections is in context
  expect(
    stats.compilation.contextDependencies.has(
      path.resolve(__dirname, 'fixtures/seperatejsonsections/sections'),
    ),
  ).toBeTruthy();

  expect(
    stats.compilation.assets[expectedAssetOutputKey].children[0]._value,
  ).toMatchSnapshot();
  expect(
    stats.compilation.assets[expectedAssetOutputKey].children[1]._value,
  ).toMatchSnapshot();

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

test('sections that have templates living in folders with a schema.json and locales to go with aswell', async () => {
  const stats = await compiler('fixtures/normalsections/');

  // Ensure sections is in context
  expect(
    stats.compilation.contextDependencies.has(
      path.resolve(__dirname, 'fixtures/normalsections/sections'),
    ),
  ).toBeTruthy();

  // Check if file has been added to assets so webpack can output it
  const expectedAssetOutputKey = '../sections/test-section.liquid';
  expect(
    stats.compilation.assets[expectedAssetOutputKey].children[0]._value,
  ).toMatchSnapshot();

  // Check if file gets written to the output file system at the correct location, and with the correct values

  // Remove the schema tags and compare the json object to snapshot
  expect(
    JSON.parse(
      stats.compilation.assets[expectedAssetOutputKey].children[1]._value
        .replace('{% schema %}', '')
        .replace('{% endschema %}', ''),
    ),
  ).toMatchSnapshot();
});

test('throws type error if `from` key is missing from options', () => {
  const options = {
    to: path.resolve(__dirname, '../dist/sections'),
  };
  const errorToBeThrown = new TypeError('Missing or Invalid From Option');
  expect(() => {
    new SlateSectionsPlugin(options);
  }).toThrowError(errorToBeThrown);
});

test('throws type error if `from` key option is not string', () => {
  const options = {
    from: 10,
    to: path.resolve(__dirname, '../dist/sections'),
  };
  const errorToBeThrown = new TypeError('Missing or Invalid From Option');
  expect(() => {
    new SlateSectionsPlugin(options);
  }).toThrowError(errorToBeThrown);
});

test('throws type error if `to` key missing from options', () => {
  const options = {
    from: path.resolve(__dirname, '../src/sections'),
  };
  const errorToBeThrown = new TypeError('Missing or Invalid To Option');
  expect(() => {
    new SlateSectionsPlugin(options);
  }).toThrowError(errorToBeThrown);
});

test('throws type error if `to` key option is not string', () => {
  const options = {
    from: path.resolve(__dirname, '../src/sections'),
    to: 10,
  };
  const errorToBeThrown = new TypeError('Missing or Invalid To Option');
  expect(() => {
    new SlateSectionsPlugin(options);
  }).toThrowError(errorToBeThrown);
});
