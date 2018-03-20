const hostedGitInfo = jest.genMockFromModule('hosted-git-info');

const TEST_INFO = {
  type: 'github',
  domain: 'github.com',
  user: 'shopify',
  project: 'test-repo',
  ssh() {
    return 'git@github.com:shopify/test-repo.git';
  },
  https() {
    return 'https://github.com/shopify/test-repo';
  },
};

function fromUrl(repo) {
  let info;

  if (repo === 'shopify/test-repo') {
    info = TEST_INFO;
  }

  if (repo === 'shopify/test-repo#123456') {
    info = TEST_INFO;
    info.committish = '123456';
  }

  return info;
}

hostedGitInfo.fromUrl = fromUrl;

module.exports = hostedGitInfo;
