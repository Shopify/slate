'use strict';

const leakyBucket = require('../leakyBucket');
const {expectRejection} = require('./helpers/testHelpers');

describe('leakyBucket()', () => {
  it('returns a function that returns promises', () => {
    const wait = leakyBucket({intervalMs: 1});
    expect(wait).toBeInstanceOf(Function);

    const promise = wait();
    expect(promise).toBeInstanceOf(Promise);

    return promise;
  });

  describe('wait()', () => {
    it('rejects the returned promise if the bucket is full', async () => {
      const wait = leakyBucket({maxSize: 1, intervalMs: 1});

      const first = wait();

      const error = await expectRejection(wait());
      expect(error).toBeInstanceOf(leakyBucket.OverflowError);
      expect(error.message).toEqual('Bucket exceeded capacity of 1')

      return first; 
    });

    it('resolves subsequent promises at a regular interval', async () => {
      const wait = leakyBucket({intervalMs: 10});
      const startTime = new Date();

      const first = wait().then(() => new Date());
      const second = wait().then(() => new Date());

      const [firstTime, secondTime] = await Promise.all([first, second]);

      expect(firstTime - startTime).toBeGreaterThanOrEqual(10);
      expect(secondTime - firstTime).toBeGreaterThanOrEqual(10);
    });

    describe('config()', () => {
      it('returns the current config', () => {
        const defaultWait = leakyBucket();
        expect(defaultWait.config()).toEqual({intervalMs: 500, maxSize: 50});

        const customWait = leakyBucket({intervalMs: 10, maxSize: 100});
        expect(customWait.config()).toEqual({intervalMs: 10, maxSize: 100});
      });
    });

    describe('queueDepth()', () => {
      it('returns the current queue depth', async () => {
        const wait = leakyBucket({intervalMs: 1});
        expect(wait.queueDepth()).toEqual(0);

        const p = wait();
        expect(wait.queueDepth()).toEqual(1);

        await p;

        expect(wait.queueDepth()).toEqual(0);
      });
    });
  });
});
