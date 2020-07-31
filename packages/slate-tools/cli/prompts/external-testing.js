/* eslint-disable */
const chalk = require('chalk');
const ip = require('ip');
const inquirer = require('inquirer');
const figures = require('figures');
const SlateConfig = require('@process-creative/slate-config');

const config = new SlateConfig(require('../../slate-tools.schema'));

const question = {
  type: 'confirm',
  name: 'externalTesting',
  message: ' Continue with external device testing disabled?',
  default: true,
};

module.exports = async function promptExternalTesting() {
  const external = config.get('network.externalTesting');
  const address = config.get('network.externalTesting.address');

  if (external && address) {
    return external;
  }

  if (!ip.isPrivate(ip.address()) && external) {
    console.log(
      `\n${chalk.yellow(
        figures.warning
      )}  It looks like you are connected to the internet with the IP address,
   '${chalk.green(
     ip.address()
   )}', which is publically accessible. This could result
   in security vulnerabilities to your development machine if you want to test
   your dev store from an external device, e.g. your phone. We recommend you
   proceed with external testing disabled until you are connected to the internet
   with a private IP address, e.g. connected to a router which assigns your
   device a private IP.\n`
    );

    const answer = await inquirer.prompt([question]);

    return !answer.externalTesting;
  }

  return external;
};
