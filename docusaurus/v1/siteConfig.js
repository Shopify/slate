/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Slate', // Title for your website.
  tagline: 'A toolkit for developing Shopify themes',
  url: 'https://shopify.github.io', // Your website URL
  baseUrl: '/slate/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/slate.shopify.com/',

  // Used for publishing and more
  projectName: 'slate',
  organizationName: 'shopify',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [{href: 'https://github.com/Shopify/slate', label: 'GitHub'}],

  /* path to images for header/footer */
  headerIcon: 'img/slate.svg',
  footerIcon: 'img/slate.svg',
  favicon: 'img/favicon.png',
  disableHeaderTitle: true,

  /* Colors for website */
  colors: {
    primaryColor: '#231D1E',
    secondaryColor: '#231D1E',
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Shopify`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['/slate/js/custom.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,
  editUrl:
    'https://github.com/Shopify/slate/tree/master/docusaurus/v1/versioned_docs/version-1.0.0-beta.14/',

  // Open Graph and Twitter card images.
  ogImage: 'img/facebook-image.png',
  twitterImage: 'img/twitter-image.png',

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/Shopify/slate',
};

module.exports = siteConfig;
