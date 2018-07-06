# @shopify/slate-env

Manages the environment variables which are needed by Slate to interact with Shopify servers. Can create and run `.env` files used to store Slate environment variables for development.

By default, Slate will look for a `.env` file with environment variables.

Alternatively, users can specify `--env` with slate-tools scripts to use associated `.env.{env}` file. For example:

```
$ slate-tools start --env=production
```

will look for a `.env.production` file.

## Default .env file format

```bash
# The myshopify.com URL to your Shopify store
SLATE_STORE=

# The API password generated from a Private App
SLATE_PASSWORD=

# The ID of the theme you wish to upload files to
SLATE_THEME_ID=

# A list of file patterns to ignore, with each list item separated by ':'
SLATE_IGNORE_FILES=
```

# Store / Environment Configuration Tips

Knowing what to put in your `.env` isn't always straightforward. This guide aims to clarify what data is needed, and where to get it.

_Note: [ThemeKit](http://shopify.github.io/themekit/) is the tool that powers Slate deploys. See it's
[configuration variables documentation](http://shopify.github.io/themekit/configuration/) for more details._

### Finding your SLATE_THEME_ID

\_**warning:** some commands ([`start`](https://github.com/Shopify/slate-cli#start), [`deploy`](https://github.com/Shopify/slate-cli#deploy)) will overwrite the existing code on this `SLATE_THEME_ID` with your local project's content.
To avoid losing work, we suggest you go to [/admin/themes](//www.shopify.com/admin/themes) and duplicate
an existing theme to work from.

Go to your store's [/admin/themes.xml](//www.shopify.com/admin/themes.xml),
and copy the `id` for the theme you would like to update:

![https://screenshot.click/17-02-w0fw2-zczky.png](https://screenshot.click/17-02-w0fw2-zczky.png)

![https://screenshot.click/17-04-mng8o-k9da8.png](https://screenshot.click/17-04-mng8o-k9da8.png)

_alternatively, you can set the `SLATE_THEME_ID` to **"live"** to update the published theme_

### Generating your SLATE_PASSWORD

Navigate to your store's private apps page ([/admin/apps/private](//www.shopify.com/admin/apps/private)).

![https://screenshot.click/17-06-j9e9m-n2jxa.png](https://screenshot.click/17-06-j9e9m-n2jxa.png)

Create a new private app and copy the password:

![https://screenshot.click/17-07-u19kf-rx53b.png](https://screenshot.click/17-07-u19kf-rx53b.png)

Assign the private app permissions to "Read and Write" for theme templates and theme assets:

![https://screenshot.click/17-09-owv1p-5lugl.png](https://screenshot.click/17-09-owv1p-5lugl.png)
