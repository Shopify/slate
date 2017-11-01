/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

import $ from 'jquery';
import find from 'lodash-es/find';

export function getCart() {
  return $.getJSON('/cart.js');
}

export function updateNote(note) {
  return this._promiseChange({
    url: '/cart/update.js',
    dataType: 'json',
    data: {
      note: note || '',
    },
  });
}

export function addItem(id, quantity) {
  return this._promiseChange({
    url: '/cart/add.js',
    dataType: 'json',
    data: {
      id,
      quantity: typeof quantity === 'undefined' ? 1 : quantity,
    },
  });
}

export function addItemFromForm(data) {
  return this._promiseChange({
    url: '/cart/add.js',
    dataType: 'json',
    data,
  });
}

export function removeItem(id) {
  return this._promiseChange({
    url: '/cart/change.js',
    dataType: 'json',
    data: {
      id,
      quantity: 0,
    },
  });
}

export function changeItem(id, quantity) {
  const originalQuantity = parseInt(quantity, 10);
  const requestSettings = {
    url: '/cart/change.js',
    dataType: 'json',
    data: {
      id,
      quantity,
    },
  };

  return this._promiseChange(requestSettings);
}

export function saveLocalState(state) {
  if (_isLocalStorageSupported()) {
    localStorage.shopify_cart_state = JSON.stringify(state); // eslint-disable-line camelcase
  }

  return state;
}

export function getLocalState() {
  // eslint-disable-line consistent-return
  if (_isLocalStorageSupported()) {
    return JSON.parse(localStorage.shopify_cart_state || '');
  }
}

export function cookiesEnabled() {
  let cookieEnabled = navigator.cookieEnabled;

  if (!cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
  }
  return cookieEnabled;
}

function _promiseChange(parameters) {
  let promiseRequest = $.ajax(parameters);

  // If offline, provide a rejected promise so that an error is thrown.
  if (navigator && !theme.isOnline) {
    promiseRequest = $.Deferred().reject();
  }

  return (
    promiseRequest
      // Some cart API requests don't return the cart object. If there is no
      // cart object then get one before proceeding.
      .then(
        (state) => {
          if (typeof state.token === 'undefined') {
            return this.getCart();
          } else {
            return state;
          }
        }
      )
      .then(this.saveLocalState)
  );
}

function _isLocalStorageSupported() {
  const mod = 'localStorageTest';
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (error) {
    return false;
  }
}
