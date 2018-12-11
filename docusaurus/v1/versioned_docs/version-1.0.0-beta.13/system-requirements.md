---
id: version-1.0.0-beta.13-system-requirements
title: System requirements
original_id: system-requirements
---

## Operating System

Slate is developed and is most stable on MacOS. We hope to officially extend support to Windows and Linux in future.

### Windows Subsystem for Linux (WSL)

A few users have successfully got Slate up and running in Windows Subsystem for Linux. They used the following commands to setup their system:

```bash
sudo apt update && sudo apt -y upgrade
sudo apt install -y build-essential libssl-dev libpng-dev
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
exit
nvm install node --lts
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install -y --no-install-recommends yarn
source ~/.profile
```

For more information, visit [issue #667](https://github.com/Shopify/slate/issues/667).

## Node

You will need the current LTS (long-term support) release which you can download directly from the [Node website](https://nodejs.org/en/).

We highly recommend using NVM as a Node Version Manager which can easily be installed by running the following command in your terminal:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

For further documentation on how to install individual Node versions with NVM, visit the [GitHub repository](https://github.com/creationix/nvm#usage).

## Yarn or npm 5+

Follow the instructions on how to get started with [Yarn](https://yarnpkg.com/en/docs/install) or [npm](https://www.npmjs.com/get-npm) to make sure you’re using the latest version.

The Shopify Themes team made a decision in 2017 to migrate all theme repositories, including Slate, over to Yarn. Because of this, installing dependencies for each of our projects has become fast and reliable.

It’s important to note, both of these packages have their ups and downs and many of the fantastic features that initially launched with Yarn are now available with npm 5+, so feel free to use the one you are most comfortable with.
