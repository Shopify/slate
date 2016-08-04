# Slate
[![Circle CI](https://circleci.com/gh/Shopify/slate.svg?style=svg&circle-token=7b55fa8bdc61003d81a45d4d550621646e08d117)](https://circleci.com/gh/Shopify/slate)

Slate provides a set of tools and templates for developing Shopify themes.

Its goal is to provide developers with a fully documented and easy-to-use theme toolkit. It allows developers to manage their libraries and dependencies, to clearly structure their code, and to seamlessly deploy their themes to remote environments.

## Getting Started
Slate comes with a [CLI](https://github.com/Shopify/slate-cli) tool that allows you to run commands that help with generating, setting up and deploying Shopify themes.
Although not a requirement, it does simplify the process of working with themes.

#### 1. Install Slate CLI
Follow the [getting started](https://github.com/Shopify/slate-cli#getting-started) section to install Slate CLI on your machine.

**Note**: The steps to install Slate CLI manually will be unnecessary once we launch it as an npm package. Bear with us during this closed beta.

#### 2. Create a new project
Run the following commands to create a new project and replace `my-theme` with the name of your Shopify theme.

```shell
slate new theme my-theme
cd my-theme
```

#### 3. Add your store settings in `config.yml`.
These settings include the theme ID, password, and store URL. See [config variables](http://themekit.cat/docs/#config-variables) for more details. Generate these credentials by creating a [private app](https://help.shopify.com/api/guides/api-credentials#generate-private-app-credentials).

#### 4. Run `slate start` 
This command will build your theme from the [source files](https://github.com/Shopify/slate/tree/master/src) into a `dist` directory. A [Node.js](https://nodejs.org) server and [Browsersync](https://browsersync.io/) will start automatically once the initial build is complete.

----------

## SVG Icons

Slate uses SVG icons for easy maintainability and better front end performance. Place all of your SVG icons in `src/icons`, prefaced with the name `icon-`. E.g. `icon-arrow-down.svg`.

__Make sure the `viewBox` attribute is case sensitive.__

While `gulp` is running (or manually with `gulp build`) these icons will be optimized and converted to snippets in your `dist/snippets` folder as `symbol` elements. These snippets will be used to create a spritesheet.

Note: Illustrator doesn't render the nicest SVG icons. Sketch is suggested for creating and editing SVGs.

### Usage | customizable colors

Most icons should allow their color to be changed with CSS. Depending on the icon, this will be via the `fill` or `path` attributes.

Liquid:
```
{% include 'icon-cart' %}
```

SCSS:
```
.icon-cart {
  width: 10px;
  height: 10px;
  fill: pink; // optional
  path: blue; // optional
}
```

### Usage | full color icons

If you want the SVG to maintain its colors, append `-full-color` to the file name. E.g. `icon-shopify-logo-full-color`. The CSS is set up to prevent its colors from being overwritten. In CSS you only have to control the size of the icon.

Liquid:
```
{% include 'icon-shopify-logo-full-color' %}
```

### Usage | multiple customizable colors

If you want to get really fancy and control multiple colors through CSS instead of letting the SVG dictate, include it the same way as a normal customizable icon, and target the CSS with nth child for each path/shape.

Since you must also style the sprite in the spritesheet for this to take effect, you must assume the icon is only used once on the page. Using full color icons is preferable to this.

```
.icon-cart path:nth-child(1),
#icon-cart path:nth-child(1) {
  fill: pink;
}

.icon-cart path:nth-child(2),
#icon-cart path:nth-child(2) {
  fill: blue;
}
```

### Update a theme's icons without Gulp

If you need to add an icon to a live shop, no fret. Follow these steps:
1. Create an SVG icon.
2. Change the file from an `.svg` extension to `.liquid` and place it in `snippets/`. Make sure the file name starts with `icon-` for consistency.
3. Add `aria-hidden="true"` and `focusable="false"` to the `svg` element.
5. Add `class="icon"` to the `svg` element. Add `icon--full-color` if it's a full color icon.
6. Add a class the same name as the file name to the `svg`. E.g. `icon-cart`.
7. Remove any unneeded elements like `DOCTYPE` and `<?xml>`.
8. Include your new icon with `{% include 'icon-cart' %}`.
9. Control the size and colors in CSS with `.icon-cart`.

## Contributing
Contributions are always welcome in the form of pull requests and issues.

## License
Slate is licensed under the terms of the [MIT license](LICENSE).
