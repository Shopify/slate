describe("A money formatter", function() {
  var formatMoney = slate.Currency.formatMoney;

  it('should accept a string in cents as the first argument', function() {
    var value = formatMoney('10001');
    expect(value).to.equal('$100.01');
  });

  it('should accept a number in cents as the first argument', function() {
    var value = formatMoney(10001);
    expect(value).to.equal('$100.01');
  });

  it('should create an amount with a comma seperator', function() {
    var value = formatMoney(1000001);
    expect(value).to.equal('$10,000.01');
  });

  it('should create an amount with space seperators', function() {
    var value = formatMoney(1000001, '${{amount_with_space_separator}}');
    expect(value).to.equal('$10 000.01');
  })

  it('should create an amount with no decimals', function() {
    var value = formatMoney(10001, '${{amount_no_decimals}}');
    expect(value).to.equal('$100');
  });

  it('should create an amount with no decimals and a comma seperator', function() {
    var value = formatMoney(1000001, '${{amount_no_decimals_with_comma_separator}}');
    expect(value).to.equal('$10,000');
  });

  it('should create an amount with no decimals and a space seperator', function() {
    var value = formatMoney(1000001, '${{amount_no_decimals_with_space_separator}}');
    expect(value).to.equal('$10 000');
  })
});
