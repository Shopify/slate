# @shopify/slate-liquid-asset-loader

Parses liquid files, searching for assets that are piped to `asset_url` and transforming them into `require()` call so that images are run through the correct loader and their name are fingerprinted.
