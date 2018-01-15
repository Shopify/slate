const fs = require('fs-extra');
const execa = require('execa');

const mockFunction = jest.fn(() => {
  return Promise.resolve();
});

module.exports = function(file, args, options) {
  console.log(file, args, options);
  if (file === 'git' && args[0] === 'clone') {
    fs.__addMockFiles({
      'test-project/.git/index': 'A git repo duck typing file',
      'test-project/package.json': '{ "name": "test-repo" }',
    });

    return mockFunction(file, args, options);
  }

  if (file === 'yarnpkg' || file === 'npm') {
    return mockFunction(file, args, options);
  }

  if (typeof file === 'string') {
    options.stdio = 'ignore';
    return execa(file, args, options);
  }

  return mockFunction;
};
