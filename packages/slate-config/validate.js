function validate(schema, slaterc) {
  const tests = [isValidType];
  let errors = [];
  let warnings = [];

  tests.forEach((test) => {
    const results = test(schema, slaterc);
    errors = errors.concat(results.errors);
    warnings = warnings.concat(results.warnings);
  });

  return {
    errors,
    warnings,
    isValid: errors.length === 0,
  };
}

function extractType(item, value) {
  if (item.type === `array` && Array.isArray(value)) {
    return item.type;
  }

  return typeof value;
}

function isValidType(schema, slaterc) {
  const errors = [];
  const warnings = [];

  schema.items.forEach((item) => {
    const key = item.id;
    const value = slaterc[key];
    const type = extractType(item, value);

    if (type !== 'undefined') {
      if (type !== item.type) {
        errors.push(
          `Setting ${key}: Expected type '${
            item.type
          }' but received type '${type}'`,
        );
      }
    }
  });

  return {errors, warnings};
}

module.exports = validate;
module.exports.tests = {
  isValidType,
};
