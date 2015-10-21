Canvas [![Circle CI](https://circleci.com/gh/Shopify/canvas.svg?style=svg&circle-token=7b55fa8bdc61003d81a45d4d550621646e08d117)](https://circleci.com/gh/Shopify/canvas)
=====================

Gulp and Theme Kit
---------------------

Any Canvas-based theme will use a combination of Gulp and [Theme Kit](https://github.com/Shopify/themekit) for development and support workflows. Once setup, only edit files in `src/`. Files will be copied to `dist/` and be a mirror image of the theme uploaded to your shop. The `dist/` folder will not be tracked in GitHub.

If unsure of any step or need help, ping @cshold or @stevebosworth.

__Requirements__: [Node.js](http://nodejs.org/) (and Ruby 1.9+ on Windows).

### Setup Theme Kit

Follow the instructions on the [Theme Kit website](http://themekit.cat/) to install Theme Kit. It is the next generation, cross-platform theme editing tool that supersedes the `theme_gem`.

### Install Gulp and Dependencies

1. Navigate to your local theme folder in Terminal
  - `cd path/to/folder`
  - alternatively type `cd ` then drag the folder into Terminal. It will autocomplete the path for you

2. Install Gulp globally
<small>You may need to preface the command below with `sudo` to use proper permissions</small>

        $ npm install gulp -g

3. Install required Gulp packages
<small>You may need to preface the command below with `sudo` to use proper permissions</small>

        $ npm install

4. Setup your `dist/` folder for the first time

        $ gulp build

5. Insert private app keys
  - Rename `config-sample.yml` to `config.yml`
  - Add your private app credentials to `config.yml`. Use [this sample file](https://github.com/Shopify/canvas/blob/master/config-sample.yml) to get started. [Learn to make a private app](http://docs.shopify.com/api/authentication/creating-a-private-app).

----------

### Gulp Tasks
`$ gulp`
or
`$ gulp --sync`
- Default task
- Watches for changes in `src/` and moves changed files to `dist/`
- Concatenates `src/stylesheets/` and `src/javascripts/` files before moving to `dist/`
- Automatically compresses image files in `src/assets/`
- Uploads valid saved theme files to your store
- If using `--sync` flag, BrowserSync is enabled and will reload your browsers at http://localhost:3000
  - On mobile, navigate to your local IP on the same port. E.g. http://192.168.0.10:3000

----------

`$ gulp build`
- Builds css/js files, compresses images, and moves all files to `dist/`
- Files are not uploaded to your store
- __Files in `src/` prepended with an underscore will not be uploaded to your shop.__ E.g. `src/stylesheets/_canvas.scss.liquid` will not be transfered to `assets/`.

----------

`$ gulp deploy`
- Builds css/js files, compresses images, moves all files to `dist/`, and uploads all theme files to your shop
- Note, this will overwrite all files (including active settings) so use sparingly
  - To upload all files except `settings_data.json`, add that file to `ignore_files:` in config.yml

----------

`$ gulp zip`
- Runs `gulp build` and creates a zip with only valid theme files
