module.exports = class SlateRcError extends require('@process-creative/slate-error') {
  constructor(message) {
    // Providing default message and overriding status code.
    super(message || 'There was an error when processing the .slaterc file');
  }
};
