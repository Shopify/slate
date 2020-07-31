const {SyncHook, AsyncSeriesHook} = require('tapable');
const {sync} = require('@process-creative/slate-sync');

module.exports = class Client {
  constructor(options) {
    this.options = Object.assign({}, this.defaults, options);
    this.skipNextSync = false;
    this.files = [];
    this.hooks = {
      beforeSync: new AsyncSeriesHook(['files', 'stats']),
      sync: new SyncHook(['files', 'stats']),
      syncDone: new SyncHook(['files', 'stats']),
      afterSync: new AsyncSeriesHook(['files', 'stats']),
      syncSkipped: new SyncHook(['files', 'stats']),
    };
  }

  async sync(files, stats) {
    this.files = files;

    await this.hooks.beforeSync.promise(this.files, stats);

    if (this.files.length === 0) {
      this.skipNextSync = true;
    }

    if (this.skipNextSync) {
      this.hooks.syncSkipped.call(this.files, stats);
    } else {
      this.hooks.sync.call(this.files, stats);
      await sync(this.files);
      this.hooks.syncDone.call(this.files, stats);
    }

    this.hooks.afterSync.promise(this.files, stats);

    this.skipNextSync = false;
  }

  skipNextSync() {
    this.skipSync = true;
  }
};
