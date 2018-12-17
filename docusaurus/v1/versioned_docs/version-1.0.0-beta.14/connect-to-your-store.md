---
id: version-1.0.0-beta.14-connect-to-your-store
title: Connect to your store
original_id: connect-to-your-store
---

Now that you have a new Slate project, you need to link it to your [remote Shopify store](how-to-create-a-development-store) by updating the [`.env` file](https://github.com/Shopify/slate/blob/master/packages/slate-env/README.md) with your API credentials.

## Example `.env` file

```bash
# The myshopify.com URL to your Shopify store
SLATE_STORE={store-name}.myshopify.com

# The API password generated from a Private App
SLATE_PASSWORD=ccf7fb19ed4dc6993ac6355c0c489c7c7

# The ID of the theme you wish to upload files to
SLATE_THEME_ID=32112656003

# A list of file patterns to ignore, with each list item separated by ':'
SLATE_IGNORE_FILES=config/settings_data.json
```

## Setting SLATE_STORE

This refers to the URL of your Shopify store, e.g. store-name.myshopify.com.

> Note: the `https://` protocol is not included and neither is the trailing slash.

## Setting SLATE_PASSWORD

Create a new private app by navigating to your store’s private apps page _https://{store-name}.myshopify.com/admin/apps/private_, giving the private app a name and setting the **Theme templates and theme assets** to “Read and write”.

<img width="1009" alt="screen shot 2018-06-06 at 3 00 48 pm" src="https://user-images.githubusercontent.com/991693/41563406-7ba2f4a4-731d-11e8-9764-e851138da3f5.png">

Hit the “Save” button, edit the new private app and click “Show” to view the **Password** field. This is your `SLATE_PASSWORD`.

![image 2018-06-06 15-07-52](https://user-images.githubusercontent.com/991693/41563439-8fa3a980-731d-11e8-9a96-9c3b5b4e2473.jpg)

## Setting SLATE_THEME_ID

You can view a full list of all available theme IDs for your store by navigating to _https://{store-name}.myshopify.com/admin/themes.xml_.

![image 2018-06-06 15-48-54](https://user-images.githubusercontent.com/991693/41563505-b80c93f0-731d-11e8-94c6-ac3d18036a07.jpg)

Each theme entry will have an `id` tag. Set the `SLATE_THEME_ID` to the theme ID you want to deploy to.

> Note: When you deploy your theme, Slate will overwrite the existing remote code associated with the `SLATE_THEME_ID` you defined with your local project’s code, which you may not want. To avoid this, navigate to _https://{store-name}.myshopify.com/admin/themes_ and duplicate an existing theme ID to work from.

## Setting SLATE_IGNORE_FILES

This is the only optional setting in the `.env` file and it enables you to ignore certain files from being deployed to your Shopify store. One example would be to ignore the `settings_data.json` file to avoid overwriting your theme’s section settings every time you deploy your theme.

The file paths are relative to the theme’s `dist/` directory so ignoring the `settings_data.json` file would look like the following:

```bash
SLATE_IGNORE_FILES=config/settings_data.json
```

## Creating an alternative `.env` file

Slate allows you to define multiple environment files. Users can specify the `--env` flag with slate-tools scripts to use with an `.env.{env}` file. For example:

```bash
yarn start --env=production
```

will look for a `.env.production` file.
