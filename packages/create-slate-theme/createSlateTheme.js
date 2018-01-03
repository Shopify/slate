const hostedGitInfo = require('hosted-git-info');
const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils');
const config = require('./config');
// const report = require('./reporter');

// Executes `npm install` or `yarn install` in rootPath.
function install(rootPath) {
  const prevDir = process.cwd();

  // report.info('Installing packages...');
  process.chdir(rootPath);

  const cmd = utils.shouldUseYarn()
    ? utils.spawn('yarnpkg')
    : utils.spawn('npm install');

  return cmd.then(() => {
    return process.chdir(prevDir);
  });
}

function copyShopifyConfig(rootPath) {
  const src = config.shopifyConfig.src;
  const dest = path.join(rootPath, config.shopifyConfig.dest);
  return fs.copy(src, dest);
}

function ignored(file) {
  return (
    !/^\.(git|hg)$/.test(path.basename(file)) && !/node_modules/.test(file)
  );
}

// Copy starter from file system.
function copyFromDirectory(starterPath, rootPath) {
  if (!fs.existsSync(starterPath)) {
    throw new Error(`starter ${starterPath} doesn't exist`);
  }

  // Chmod with 755.
  // 493 = parseInt('755', 8)
  return fs.mkdirp(rootPath, {mode: 493}).then(() => {
    // report.info(`Creating new site from local starter: ${starterPath}`);
    // report.log(`Copying local starter to ${rootPath} ...`);
    return fs.copy(starterPath, rootPath, {filter: ignored});
  });
}

// Clones starter from URI.
function cloneFromGithub(hostInfo, rootPath) {
  const url = hostInfo.ssh({noCommittish: true});
  const branch = hostInfo.committish ? `-b ${hostInfo.committish}` : '';

  return utils
    .spawn(`git clone ${branch} ${url} ${rootPath} --single-branch`)
    .then(() => {
      return fs.remove(path.join(rootPath, '.git'));
    });
}

function getRepo(rootPath, repo) {
  const hostedInfo = hostedGitInfo.fromUrl(repo);
  if (hostedInfo) {
    return cloneFromGithub(hostedInfo, rootPath);
  } else {
    return copyFromDirectory(repo, rootPath);
  }
}

/**
 * Main function that clones or copies the starter.
 */
function start(rootPath, repo) {
  if (fs.existsSync(path.join(rootPath, 'package.json'))) {
    throw new Error(`A project already exists in ${rootPath} directory`);
  }

  return getRepo(rootPath, repo)
    .then(() => {
      return copyShopifyConfig(rootPath);
    })
    .then(() => {
      return install(rootPath);
    });
}

module.exports = start;
