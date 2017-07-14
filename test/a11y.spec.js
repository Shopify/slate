window.$ = require('../src/scripts/vendor/jquery-2.2.3.min');
require('../src/scripts/slate/a11y');

var template = require('fs').readFileSync('./test/a11y.spec.html').toString();
document.body.innerHTML = template;

var trapFocus = slate.a11y.trapFocus;

describe('a11y.trapFocus', () => {

  trapFocus({
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

  // Test namespace

  // Test when there's no $elementToFocus

  // Find a way to test if overall trapFocus works? Maybe loop with tab events and make sure an
  // element outside #modal is never focused? o_O


});