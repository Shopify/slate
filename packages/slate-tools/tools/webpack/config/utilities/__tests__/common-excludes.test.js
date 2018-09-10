test(`includes the values specified in 'webpack.commonExcludes' config`, () => {
  global.slateUserConfig = {
    'webpack.commonExcludes': ['some', 'values'],
  };
  const commonExcludes = require('../common-excludes');

  global.slateUserConfig['webpack.commonExcludes'].forEach((item) => {
    expect(commonExcludes().toString()).toMatch(item);
  });
});
