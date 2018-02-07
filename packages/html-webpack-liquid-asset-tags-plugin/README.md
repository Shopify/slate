# @shopify/html-webpack-liquid-asset-tags-plugin

An [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin) addon which swaps out generated `<link>` and `<script>` asset URLs with Shopify Liquid tags using the [`asset_url` filter](https://help.shopify.com/themes/liquid/filters/url-filters#asset_url). For example:

```
<script type=text/javascript src="theme.js"></script>
```

gets transformed into

```
<script type=text/javascript src="{{ 'theme.js' | asset_url }}"></script>
```
