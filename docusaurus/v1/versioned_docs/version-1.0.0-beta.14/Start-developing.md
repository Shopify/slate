---
id: version-1.0.0-beta.14-start-developing
title: Start developing
original_id: start-developing
---

Now comes the fun part! To begin developing your very own theme with Slate's development pipeline, run the following command:

```bash
yarn start
```

_(or, if you're using npm, `npm start`)_

This compiles your local theme files into a `dist` directory, uploads these files to your remote Shopify store and finally boots up a local Express server that will serve your CSS and JavaScript assets from `https://xxx.xxx.xxx.xxx:3001`.

![screencast-2018-05-03-12-47-12](https://user-images.githubusercontent.com/991693/39592192-0e30b2ca-4ed4-11e8-9950-aae54248351c.gif)

> **Note**: Because we are running the server on `https://`, you will either need to [create a self-signed SSL Certificate](create-a-self-signed-ssl-certificate) or visit the asset server URL at least once and tell your browser to "trust it". Otherwise, local assets will be blocked and your theme will appear broken.

## Specifying a different environment

By default, Slate will look for an `.env` file in the root of your theme directory. However, users can specify an `--env` flag to target specific environments. These environment files need to be named `.env.{env}`.

For example, the following command will target an `.env.production` file:

```bash
yarn start --env=production
```
