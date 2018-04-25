const fs = require('fs');
const path = require('path');

jest.dontMock('fs-extra');

describe('concatStyles()', () => {
  test('inlines stylesheet files into a single string', async () => {
    const {concatStyles} = require('../concat');
    const rootPath = path.resolve(__dirname, './fixtures/style.css');
    const content = fs.readFileSync(rootPath, 'utf8');
    const concatenated = fs.readFileSync(
      require.resolve('./fixtures/concatenated.css'),
      'utf8',
    );

    const results = await concatStyles(content, rootPath);

    expect(results.replace(/\s/g, '')).toBe(concatenated.replace(/\s/g, ''));
  });
});

describe('getImportStatements()', () => {
  test('returns an array of CSS @import statements found within a string', () => {
    const {getImportStatements} = require('../concat');
    const contents = `
      @import url('./other.css.liquid');
      @import url('./another.css.liquid');`;
    const imports = getImportStatements(contents);

    expect(imports.length).toBe(2);
    expect(imports[0]).toBeInstanceOf(Array);
    expect(imports[0][0]).toBe("@import url('./other.css.liquid');");
  });

  test('ignores @import statements inside comments by default', () => {
    const {getImportStatements} = require('../concat');
    const contents = `
      @import url('./other.css.liquid');
      /* @import url('./anotherOne.css.liquid'); */
      // @import url('./something.css.liquid');
      @import url('./another.css.liquid');`;
    const imports = getImportStatements(contents);

    expect(imports.length).toBe(2);
  });

  test('ignores @import statements which are not followed by a url(...) statement', () => {
    const {getImportStatements} = require('../concat');
    const contents = `
      @import './something.css.liquid';
      @import url('./another.css.liquid');`;
    const imports = getImportStatements(contents);

    expect(imports.length).toBe(1);
  });

  test('can include @import statements inside comments', () => {
    const {getImportStatements} = require('../concat');
    const contents = `
      @import url('./other.css.liquid');
      /* @import url('./another.css.liquid'); */
      @import url('./another.css.liquid');`;
    const imports = getImportStatements(contents, false);

    expect(imports.length).toBe(3);
  });
});

describe('getImportURL()', () => {
  test('returns a valid URL if @import statement uses single quotes', () => {
    const {getImportURL} = require('../concat');
    const url = getImportURL("@import url('foo.css');");
    expect(url).toBe('foo.css');
  });

  test('returns a valid URL if @import statement uses single quotes', () => {
    const {getImportURL} = require('../concat');
    const url = getImportURL('@import url("foo.css");');
    expect(url).toBe('foo.css');
  });

  test('returns a valid URL if @import statement has leading or trailing whitespace', () => {
    const {getImportURL} = require('../concat');
    const url = getImportURL('@import url(" foo.css ");');
    expect(url).toBe('foo.css');
  });
});
