const chalk = require('chalk');
const slateEnv = require('@shopify/slate-env');

/**
 * Retrieve the requested environment form the Shopify config file or die otherwise.
 *
 * @return String|void
 */
module.exports = (envName) => {
  try {
    slateEnv.assign(envName);
  } catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
  }

  const result = slateEnv.validate();

  if (!result.isValid) {
    console.log(
      chalk.red(
        `Some values in environment '${slateEnv.getEnvNameValue()}' are invalid:`,
      ),
    );
    result.errors.forEach((error) => {
      console.log(chalk.red(`- ${error}`));
    });

    process.exit(1);
  }
};
