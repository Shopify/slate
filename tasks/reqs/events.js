var eventEmitter = require('events');
var event = new eventEmitter.EventEmitter();

var events = {
  emitEvt: function(str) {
    event.emit(str);
  },
  onEvt: function(str, callback) {
    event.on(str, callback);
  },
  onceEvt: function(str, callback) {
    event.once(str, callback);
  }
};

module.exports = events;
