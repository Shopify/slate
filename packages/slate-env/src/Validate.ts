import { config } from "./Config";
import { getStoreValue, getPasswordValue, getThemeIdValue } from "./Value";

export const validateStore = () => {
  const errors = [];
  const store = getStoreValue();

  if (store.length === 0) {
    errors.push(new Error(`${config.get('env.keys.store')} must not be empty`));
  } else if (
    store.indexOf('.myshopify.com') < 1 &&
    store.indexOf('.myshopify.io') < 1
  ) {
    errors.push(
      new Error(
        `${config.get('env.keys.store')} must be a valid .myshopify.com URL`,
      ),
    );
  } else if (store.slice(-1) === '/') {
    errors.push(
      new Error(
        `${config.get('env.keys.store')} must not end with a trailing slash`,
      ),
    );
  }

  return errors;
}

export const validatePassword = () => {
  const errors = [];
  const password = getPasswordValue();

  if (password.length === 0) {
    errors.push(
      new Error(`${config.get('env.keys.password')} must not be empty`),
    );
  } else if (!/^\w+$/.test(password)) {
    errors.push(
      new Error(
        `${config.get(
          'env.keys.password',
        )} can only contain numbers and letters`,
      ),
    );
  }

  return errors;
}

export const validateThemeId = () => {
  const errors = [];
  const themeId = getThemeIdValue();

  if (themeId.length === 0) {
    errors.push(
      new Error(`${config.get('env.keys.themeId')} must not be empty`),
    );
  } else if (themeId !== 'live' && !/^\d+$/.test(themeId)) {
    errors.push(
      new Error(
        `${config.get(
          'env.keys.themeId',
        )} can be set to 'live' or a valid theme ID containing only numbers`,
      ),
    );
  }

  return errors;
}