import find from 'lodash-es/find';
import findIndex from 'lodash-es/findIndex';
import isArray from 'lodash-es/isArray';

export function validate(product) {
  if (typeof product !== 'object' || typeof product.id !== 'number') {
    throw Error('Please pass a valid Product object to the Product Controller');
  }

  return $.extend({}, product);
}

export function getVariant(product, value) {
  var variant;

  if (typeof value === 'string' || typeof value === 'number') {
    // If value is an id
    variant = this._getVariantFromId(product, value);
  } else if (typeof value === 'object' && typeof value.id === 'number') {
    // If value is a variant object containing an id key
    variant = this._getVariantFromId(product, value.id);
  } else if (isArray(value)) {
    // If value is an array of options
    if (typeof value[0] === 'object') {
      // If value is a collection of options with name and value keys
      variant = this._getVariantFromOptionCollection(product, value);
    } else {
      // If value is an array of option values, ordered by index of array
      variant = this._getVariantFromOptionArray(product, value);
    }
  }

  return variant;
}

export function optionArrayFromOptionCollection(product, collection) {
  var optionArray = [];

  collection.forEach(function(option) {
    var index;

    if (typeof option.name !== 'string') {
      throw Error('Invalid value type passed for name of option ' + index + '. Value should be string.');
    }

    index = findIndex(product.options, function(name) {
      return name.toLowerCase() === option.name.toLowerCase();
    });

    if (index === -1) {
      throw Error('Invalid option name, ' + option.name);
    }

    optionArray[index] = option.value;
  });

  return optionArray;
}

function _getVariantFromId(product, id) {
  return find(product.variants, {id: id});
}

function _getVariantFromOptionCollection(product, collection, closest) {
  var optionArray = this.optionArrayFromOptionCollection(product, collection);

  return this._getVariantFromOptionArray(product, optionArray, closest);
}

function _getVariantFromOptionArray(product, options) {
  return find(product.variants, function(variant) {
    return options.every(function(option, index) {
      return variant.options[index] === option;
    });
  });
}

