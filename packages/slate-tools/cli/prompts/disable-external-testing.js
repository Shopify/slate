/* eslint-disable */
const chalk = require('chalk');
const ip = require('ip');
const inquirer = require('inquirer');
const figures = require('figures');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

const question = {
  type: 'confirm',
  name: 'disableExternalTesting',
  message: ' Continue with external device testing disabled?',
  default: true,
};

module.exports = async function promptDisableExternalTesting() {
  let address = ip.address();

  if (!config.get('network.externalTesting')) {
    address = 'localhost';
  } else if (!ip.isPrivate(address)) {
    console.log(
      `\n${chalk.yellow(
        figures.warning
      )}  It looks like you are connected to the internet with the IP address,
   '${chalk.green(address)}', which is publically accessible. This could result
   in security vulnerabilities to your development machine if you want to test
   your dev store from an external device, e.g. your phone. We recommend you
   proceed with external testing disabled until you are connected to the internet
   with a private IP address, e.g. connected to a router which assigns your
   device a private IP.\n`
    );

    const answer = await inquirer.prompt([question]);

    address = answer.disableExternalTesting ? 'localhost' : address;
  }

  return address;
};
