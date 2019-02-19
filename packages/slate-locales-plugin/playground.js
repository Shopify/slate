const compiler = require('./__tests__/helpers/compiler');

// eslint-disable-next-line func-style
const test = async () => {
  const stats = await compiler('fixtures/seperatejsonsections/');
  debugger;
};

test();
