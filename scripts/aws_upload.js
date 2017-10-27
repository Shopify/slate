#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const tag = require('../lerna.json').version;
const DEFAULT_CONTENT_TYPE = 'application/zip';
const S3_DIR = 'slate';
const DEFAULT_CACHE_CONTROL = 'public, max-age=86400';
const ZIP_DIR = 'packages/slate-theme/upload';
const DIST_DIR = 'packages/slate-theme/dist';
const DIST_FILES = [
  'assets/theme.js',
  'assets/vendor.js'
];

var Uploader = function () {
  AWS.config.credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
  AWS.config.region = 'us-east-1';
  this.s3 = new AWS.S3();
  this.themeZips = fs.readdirSync(ZIP_DIR);
};

Uploader.prototype.uploadFile = function(localPath, s3Path) {
  this.s3.putObject({
    Bucket: process.env.AWS_BUCKET,
    Key: s3Path,
    ContentType: this.contentType(localPath),
    CacheControl: DEFAULT_CACHE_CONTROL,
    Body: fs.readFileSync(localPath),
    ACL: 'public-read'
  }, (err, data) => {
    if (err) {
      console.error(err, err.stack);
    } else {
      console.log('successfully uploaded ' + s3Path);
    }
  });
};

Uploader.prototype.uploadTheme = function () {
  this.themeZips.forEach(file => {
    this.uploadFile(path.join(ZIP_DIR, file), this.s3PathForFile(file, tag));
    this.uploadFile(path.join(ZIP_DIR, file), this.s3PathForFile(file, `/latest`));
  });
};

Uploader.prototype.uploadAssets = function() {
  DIST_FILES.forEach(file => {
    this.uploadFile(path.join(DIST_DIR, file), this.s3PathForFile(file, tag));
    this.uploadFile(path.join(DIST_DIR, file), this.s3PathForFile(file, `/latest`));
  })
}

Uploader.prototype.s3PathForFile = function (localPath, tag) {
  return path.join(S3_DIR, tag, localPath);
};

Uploader.prototype.contentType = function(path) {
  return mime.lookup(path) || DEFAULT_CONTENT_TYPE ;
};

new Uploader().uploadTheme();
new Uploader().uploadAssets();
