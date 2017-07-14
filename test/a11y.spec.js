// Add jQuery
window.$ = require('../src/scripts/vendor/jquery-2.2.3.min');
// Load a basic template
const template = require('fs').readFileSync('./test/a11y.spec.html').toString();

require('../src/scripts/slate/utils');
require('../src/scripts/slate/a11y');

document.body.innerHTML = template;

describe('a11y.trapFocus', () => {

  slate.a11y.trapFocus({
    $container: $('#modal'),
    $elementToFocus: $('#button'),
    namespace: 'slatenamespace'
  });

  test('$container should have a -1 tabindex attribute', () => {
    expect($('#modal').attr('tabindex')).toEqual("-1");
  });

  test('Focus on $button when trapFocus is called', () => {
    expect($('#button').is(":focus")).toBe(true);
  });

});