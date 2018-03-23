const {SyncHook, AsyncSeriesHook} = require('tapable');
const {sync} = require('@shopify/slate-sync');

module.exports = class Client {
  constructor(options) {
    this.options = Object.assign({}, this.defaults, options);
    this.skipNextSync = false;
    this.files = [];
    this.hooks = {
      beforeSync: new AsyncSeriesHook(['files']),
      sync: new SyncHook(['files']),
      syncDone: new SyncHook(['files']),
      afterSync: new SyncHook(['files']),
      syncSkipped: new SyncHook(['files']),
    };
  }

  async sync(files) {
    this.files = files;

    await this.hooks.beforeSync.promise(this.files);

    if (this.files.length === 0) {
      this.skipNextSync = true;
    }

    if (this.skipNextSync) {
      this.hooks.syncSkipped.call(this.files);
    } else {
      this.hooks.sync.call(this.files);
      await sync(this.files);
      this.hooks.syncDone.call(this.files);
    }

    this.hooks.afterSync.call(this.files);

    this.skipNextSync = false;
  }

  skipNextSync() {
    this.skipSync = true;
  }
};
