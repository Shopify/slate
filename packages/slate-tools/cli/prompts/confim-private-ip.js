/* eslint-disable */
const chalk = require('chalk');
const ip = require('ip');
const inquirer = require('inquirer');
const slateEnv = require('@shopify/slate-env');
const {event} = require('@shopify/slate-analytics');
const {fetchMainThemeId} = require('@shopify/slate-sync');
const figures = require('figures');
const {argv} = require('yargs');

const question = {
  type: 'confirm',
  name: 'disableExternalTesting',
  message: ' Continue with external device testing disabled?',
  default: true,
};

module.exports = async function promptDisableExternalTesting() {
  let address = ip.address();

  if (!ip.isPrivate(address)) {
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
