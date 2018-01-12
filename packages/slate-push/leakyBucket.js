'use strict';

class OverflowError extends Error {}

module.exports = function leakyBucket({intervalMs = 500, maxSize = 50} = {}) {
  const queue = [];
  let workTimeout = null;

  function work() {
    if (queue.length === 0) return;
    if (workTimeout) return;

    workTimeout = setTimeout(() => {
      workTimeout = null;
      if (queue.length === 0) return;

      const [resolve] = queue.shift();
      resolve();

      work();
    }, intervalMs);
  }

  function wait() {
    return new Promise((resolve, reject) => {
      if (queue.length >= maxSize) {
        const err = new OverflowError(`Bucket exceeded capacity of ${maxSize}`);
        reject(err);
        return;
      }
      queue.push([resolve, reject]);
      work();
    });
  }

  wait.config = () => ({intervalMs, maxSize});

  wait.queueDepth = () => queue.length;

  return wait;
};

module.exports.OverflowError = OverflowError;