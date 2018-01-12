'use strict';

module.exports.expectRejection = async function expectRejection(promise) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('Promise should not have been fulfilled');
};
