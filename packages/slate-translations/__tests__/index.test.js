const path = require('path');
const slateTranslations = require('../');

jest.unmock('fs-extra');

test('combines JSON files contained inside a locales folder into a single JSON object', async () => {
  const localizedSchema = await slateTranslations.combineLocales(
    path.resolve(__dirname, 'fixtures/test-section/locales'),
  );

  expect(localizedSchema).toMatchSnapshot();

  expect(
    await slateTranslations.createSchemaContentWithLocales(
      localizedSchema,
      path.resolve(__dirname, 'fixtures/test-section/schema.json'),
    ),
  ).toMatchSnapshot();
});
