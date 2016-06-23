window.slate = window.slate || {};

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

slate.formatMoney = function(cents, format) {
  if (typeof cents === 'string') { cents = cents.replace('.', ''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || theme.moneyFormat);

  function formatWithDelimiters(options) {
    var precision = options.precision || 2;
    var thousands = options.thousands || ',';
    var decimal = options.decimal || '.';

    if (isNaN(options.number) || options.number === null) { return 0; }

    var number = (options.number / 100.0).toFixed(precision);

    var parts = number.split('.');
    var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    cents = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
  case 'amount':
    value = formatWithDelimiters({
      number: cents,
      precision: 2
    });
    break;
  case 'amount_no_decimals':
    value = formatWithDelimiters({
      number: cents,
      precision: 0
    });
    break;
  case 'amount_with_comma_separator':
    value = formatWithDelimiters({
      number: cents,
      precision: 2,
      thousands: '.',
      decimal: ','
    });
    break;
  case 'amount_no_decimals_with_comma_separator':
    value = formatWithDelimiters({
      number: cents,
      precision: 0,
      thousands: '.',
      decimal: ','
    });
    break;
  case 'amount_no_decimals_with_space_separator':
    value = formatWithDelimiters({
      number: cents,
      precision: 0,
      thousands: ' '
    });
    break;
  }

  return formatString.replace(placeholderRegex, value);
};
