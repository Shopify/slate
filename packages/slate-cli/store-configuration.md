# Store / Environment Configuration Tips

Knowing what to put in your `config.yml` isn't always straightforward.  This guide aims to clarify what data is needed, and where to get it.

#### `config.yml` environment properties

- **store:** the shopify-specifc URL for this store/ environment (ie. [my-store.myshopify.com](https://my-store.myshopify.com)).
- **theme_id:** the unique id for the theme you want to write to when deploying to this store / environment
- **password:** the password generated via a private app on this store / environment (necessary for API access)

### Finding your theme_id

_**warning:** some commands ([`start`](#start), [`deploy`](#deploy)) will overwrite the existing code on this `theme_id` with empty boilerplate. 
To avoid losing work, we suggest you go to [/admin/themes](https://my-store.myshopify.com/admin/themes) and duplicate 
an existing theme to work from._

Go to your store's [/admin/themes.xml](https://my-store.myshopify.com/admin/themes.xml),
and copy the `id` for the theme you would like to update:

  ![https://screenshot.click/17-02-w0fw2-zczky.png](https://screenshot.click/17-02-w0fw2-zczky.png)
  
  ![https://screenshot.click/17-04-mng8o-k9da8.png](https://screenshot.click/17-04-mng8o-k9da8.png)
  
  _alternatively, you can set the `theme_id` to **"live"** to update the published theme_
  
### Generating your password

  Navigate to your store's private apps page ([/admin/apps/private](https://my-store.myshopify.com/admin/apps/private)). 
  
  ![https://screenshot.click/17-06-j9e9m-n2jxa.png](https://screenshot.click/17-06-j9e9m-n2jxa.png)
  
  Create a new private app and copy the password:
  
  ![https://screenshot.click/17-07-u19kf-rx53b.png](https://screenshot.click/17-07-u19kf-rx53b.png)
  
  Assign the private app permissions to "Read and Write" for theme templates and theme assets:
  
  ![https://screenshot.click/17-09-owv1p-5lugl.png](https://screenshot.click/17-09-owv1p-5lugl.png)

_Note: [ThemeKit](http://themekit.cat) is the tool that powers Slate deploys.  See it's 
[configuration variables documentation](http://themekit.cat/docs/#config-variables) for more details._