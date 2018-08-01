# Change Log

## v1.0.0-beta.6 (2018-08-01)

#### :bug: Bug Fix

* `slate-tools`
  * [#695](https://github.com/Shopify/slate/pull/695) Rename jsonP function. ([@t-kelly](https://github.com/t-kelly))
* `slate-tag-webpack-plugin`
  * [#662](https://github.com/Shopify/slate/pull/662) Only set theme_packaged_with if the first settings panel is theme_info. ([@davidcornu](https://github.com/davidcornu))

#### :memo: Documentation

* `slate-env`
  * [#664](https://github.com/Shopify/slate/pull/664) Fix typo in .env config comment. ([@myabc](https://github.com/myabc))

#### Committers: 3

* Alex Coles ([myabc](https://github.com/myabc))
* David Cornu ([davidcornu](https://github.com/davidcornu))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-beta.5 (2018-06-26)

#### :bug: Bug Fix

* `slate-tools`
  * [#654](https://github.com/Shopify/slate/pull/654) Fix build break when missing fonts directory. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 1

* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-beta.4 (2018-06-26)

#### :broken_heart: Breaking

* `slate-tools`
  * [#642](https://github.com/Shopify/slate/pull/642) BREAKING: Add load logic and preload future styles and scripts. ([@t-kelly](https://github.com/t-kelly))

#### :rocket: Enhancement

* `slate-tools`
  * [#647](https://github.com/Shopify/slate/pull/647) Copy the contents of src/assets/images and src/assets/fonts. ([@t-kelly](https://github.com/t-kelly))

#### :bug: Bug Fix

* `slate-sync`, `slate-tools`
  * [#643](https://github.com/Shopify/slate/pull/643) Throw an error if we fail to access Theme API. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 1

* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-beta.3 (2018-06-19)

#### :rocket: Enhancement

* `slate-cssvar-loader`
  * [#621](https://github.com/Shopify/slate/pull/621) Modified slate-cssvar-loader to allow CSS variables without Liquid variables, V2. ([@truribe](https://github.com/truribe))

#### Committers: 3

* Chris Berthe ([chrisberthe](https://github.com/chrisberthe))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))
* Travis Uribe ([truribe](https://github.com/truribe))

## v1.0.0-beta.2 (2018-05-25)

#### :rocket: Enhancement

* `slate-analytics`, `slate-env`
  * [#592](https://github.com/Shopify/slate/pull/592) Add SLATE_USER_EMAIL env variable for slate-analytics. ([@t-kelly](https://github.com/t-kelly))
* `slate-tools`
  * [#546](https://github.com/Shopify/slate/pull/546) Set CSSNano z-index to false in production config. ([@chrisberthe](https://github.com/chrisberthe))

#### :bug: Bug Fix

* `slate-analytics`
  * [#529](https://github.com/Shopify/slate/pull/529) Update the URL for analytics docs. ([@t-kelly](https://github.com/t-kelly))

#### :house: Internal

* [#573](https://github.com/Shopify/slate/pull/573) Goodbye CircleCI :wave:. ([@shopify-admins](https://github.com/shopify-admins))

#### Committers: 4

* Chris Berthe ([chrisberthe](https://github.com/chrisberthe))
* R. V. d. Mijnsbrugge ([rvdmijnsbrugge](https://github.com/rvdmijnsbrugge))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))
* [shopify-admins](https://github.com/shopify-admins)

## v1.0.0-beta.1 (2018-05-03)

#### :rocket: Enhancement

* `html-webpack-liquid-asset-tags-plugin`

  * [#521](https://github.com/Shopify/slate/pull/521) Update liquid-asset-plugin to use tapable.hooks. ([@t-kelly](https://github.com/t-kelly))

* `slate-cssvar-loader`

  * [#520](https://github.com/Shopify/slate/pull/520) Change the the default CSS var declaration file to theme.liquid ([@t-kelly](https://github.com/t-kelly))

* `slate-tools`
  * [#519](https://github.com/Shopify/slate/pull/519) Breaking: assets/vendors to assets/static. ([@t-kelly](https://github.com/t-kelly))

#### :bug: Bug Fix

* [#517](https://github.com/Shopify/slate/pull/517) Fix CircleCI running with Node 10. ([@t-kelly](https://github.com/t-kelly))

* `slate-analytics`

  * [#522](https://github.com/Shopify/slate/pull/522) Remove circular reference in Slate Analytics event ([@t-kelly](https://github.com/t-kelly))

* `slate-cssvar-loader`
  * [#515](https://github.com/Shopify/slate/pull/515) [slate-cssvar-loader] Escape double quotes from liquid variable. ([@mmorissette](https://github.com/mmorissette))

#### :memo: Documentation

* `slate-tools`
  * [#516](https://github.com/Shopify/slate/pull/516) Make instructions for prompt settings more obvious. ([@chrisberthe](https://github.com/chrisberthe))

#### Committers: 1

* Chris Berthe ([chrisberthe](https://github.com/chrisberthe))
* Martin Morissette ([mmorissette](https://github.com/mmorissette))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-alpha.29 (2018-04-27)

#### :rocket: Enhancement

* `concat-style-loader`
  * [#510](https://github.com/Shopify/slate/pull/510) Ignore `@import` statements which are not followed by `url(..)`. ([@t-kelly](https://github.com/t-kelly))

#### :bug: Bug Fix

* `create-slate-theme`
  * [#513](https://github.com/Shopify/slate/pull/513) Make sure paths with spaces don't break Create Slate Theme. ([@t-kelly](https://github.com/t-kelly))
* `slate-liquid-asset-loader`, `slate-tools`
  * [#512](https://github.com/Shopify/slate/pull/512) Fix asset url generated in slate-tools start. ([@t-kelly](https://github.com/t-kelly))
* `slate-cssvar-loader`
  * [#506](https://github.com/Shopify/slate/pull/506) Fix default cssVarLoaderLiquidPath for the slate-cssvar-loader package. ([@mmorissette](https://github.com/mmorissette))

#### Committers: 2

* Martin Morissette ([mmorissette](https://github.com/mmorissette))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-alpha.28 (2018-04-18)

#### :bug: Bug Fix

* `concat-style-loader`
  * [#500](https://github.com/Shopify/slate/pull/500) Add @import file as dependencies in concat-css-loader. ([@t-kelly](https://github.com/t-kelly))
* `slate-tools`
  * [#498](https://github.com/Shopify/slate/pull/498) Fix files uploaded by the dev server. ([@t-kelly](https://github.com/t-kelly))
  * [#495](https://github.com/Shopify/slate/pull/495) Add path module to dev-server/ssl module. ([@t-kelly](https://github.com/t-kelly))
  * [#494](https://github.com/Shopify/slate/pull/494) Adds concat-style-loader to slate-tools package.json. ([@t-kelly](https://github.com/t-kelly))

#### :memo: Documentation

* `slate-tools`
  * [#497](https://github.com/Shopify/slate/pull/497) Update prompt settings instructions. ([@chrisberthe](https://github.com/chrisberthe))

#### Committers: 2

* Chris Berthe ([chrisberthe](https://github.com/chrisberthe))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-alpha.27 (2018-04-17)

### BREAKING CHANGES

* [#450](https://github.com/Shopify/slate/pull/450) Webpack v4. Add template and layout specific JS entrypoints.
* [#488](https://github.com/Shopify/slate/pull/488) Add concat-style-loader to handle Liquid Style files. ([@t-kelly](https://github.com/t-kelly))

Huge performance improvements for Themes on it's way with the introduction of Webpack 4 and its automatic bundle splitting. This allows Layouts and Templates to have their own independent JS and CSS bundles that are only loaded on the appropriate page(s). Say goodbye to JS and CSS bloat!

You must now include the following in the `<head>` of any layout file you wish to have JS and CSS. For example, this is what you would put inside the `<head>` of your `layout/theme.liquid` file:

```
{% include 'script-tags', layout: 'theme' %}
{% include 'style-tags' %}
```

These snippets are generated automatically by Slate Tools at build. Their contents include `<script>` and `<link>` tags for each JS and CSS bundles.

You now must also have a `src/assets/scripts/layout` folder and a `src/assets/scripts/templates`. Any file contained in these folders which have a name the same as their Liquid counterpart is considered an entrypoint. For example, if I create a `src/assets/scripts/templates/index.js` file, it's contents will only be downloaded and run when a user visits the Index page.

#### :rocket: Enhancement

* `concat-style-loader`, `slate-tools`
  * [#488](https://github.com/Shopify/slate/pull/488) Add concat-style-loader to handle Liquid Style files. ([@t-kelly](https://github.com/t-kelly))
* `slate-sync`, `slate-tools`
  * [#474](https://github.com/Shopify/slate/pull/474) Add --replace flag to the deploy command. ([@t-kelly](https://github.com/t-kelly))
* `create-slate-theme`, `html-webpack-liquid-asset-tags-plugin`, `slate-analytics`, `slate-sync`, `slate-tag-webpack-plugin`, `slate-tools`
  * [#450](https://github.com/Shopify/slate/pull/450) Webpack v4. Add template and layout specific JS entrypoints.. ([@t-kelly](https://github.com/t-kelly))

#### :bug: Bug Fix

* `slate-config`
  * [#482](https://github.com/Shopify/slate/pull/482) Incorrect type checking when building config objects. ([@t-kelly](https://github.com/t-kelly))

#### :memo: Documentation

* `slate-tools`
  * [#478](https://github.com/Shopify/slate/pull/478) Fix typo at packages/slate-tools/README.md. ([@jbruni](https://github.com/jbruni))

#### :house: Internal

* `slate-sync`, `slate-tools`
  * [#480](https://github.com/Shopify/slate/pull/480) Refactor slate-tools start command. ([@t-kelly](https://github.com/t-kelly))
* `slate-babel`, `slate-common-excludes`, `slate-tools`
  * [#473](https://github.com/Shopify/slate/pull/473) Remove slate-babel and slate-common-excludes. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 2

* J Bruni ([jbruni](https://github.com/jbruni))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-alpha.26 (2018-03-27)

#### :bug: Bug Fix

* `slate-tools`
  * [#458](https://github.com/Shopify/slate/pull/448) Fix fake SSL certificate path in slate-tools start command. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 3

* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-alpha.25 (2018-03-23)

#### :rocket: Enhancement

* `slate-sync`, `slate-tools`
  * [#453](https://github.com/Shopify/slate/pull/453) Add --skipPrompts flag. ([@t-kelly](https://github.com/t-kelly))
  * [#439](https://github.com/Shopify/slate/pull/439) Prompt user if uploading settings_data.json. ([@t-kelly](https://github.com/t-kelly))
* `slate-tools`
  * [#438](https://github.com/Shopify/slate/pull/438) Add lint and format command. ([@t-kelly](https://github.com/t-kelly))
* `create-slate-theme`
  * [#445](https://github.com/Shopify/slate/pull/445) Default to https when cloning new Slate theme. ([@t-kelly](https://github.com/t-kelly))

#### :bug: Bug Fix

* `create-slate-theme`
  * [#446](https://github.com/Shopify/slate/pull/446) Fix Node version check and error. ([@t-kelly](https://github.com/t-kelly))

#### :memo: Documentation

* `slate-tools`
  * [#454](https://github.com/Shopify/slate/pull/454) Add docs for --skipPrompts flag. ([@t-kelly](https://github.com/t-kelly))
* Other
  * [#426](https://github.com/Shopify/slate/pull/426) Clearer SCSS Documentation. ([@jesster2k10](https://github.com/jesster2k10))

#### :house: Internal

* `slate-tools`
  * [#417](https://github.com/Shopify/slate/pull/417) marks webpack compilation script error with process.exit(1). ([@rickitan](https://github.com/rickitan))
* `slate-babel`, `slate-common-excludes`, `slate-config`, `slate-cssvar-loader`, `slate-env`, `slate-rc`, `slate-sync`, `slate-tools`
  * [#413](https://github.com/Shopify/slate/pull/413) Slate tools refactor. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 3

* Jesse Onolememen ([jesster2k10](https://github.com/jesster2k10))
* Ricardo Macario ([rickitan](https://github.com/rickitan))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v1.0.0-alpha.24 (2018-02-21)

#### :rocket: Enhancement

* `slate-cssvar-loader`
  * [#397](https://github.com/Shopify/slate/pull/397) Grab the entire cssvar value when running the slate-cssvar-loader ([@mmorissette](https://github.com/mmorissette))
* `slate-config`, `slate-env`
  * [#405](https://github.com/Shopify/slate/pull/405) Add helpful comments to generated `.env` file. ([@t-kelly](https://github.com/t-kelly))

#### :memo: Documentation

* [#400](https://github.com/Shopify/slate/pull/400) Add docs on using yarn start with env flag. ([@jonathanmoore](https://github.com/jonathanmoore))

#### Committers: 3

* Jonathan Moore ([jonathanmoore](https://github.com/jonathanmoore))
* Martin Morissette ([mmorissette](https://github.com/mmorissette))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v0.13.0 (2017-10-30)

#### :rocket: Enhancement

* `slate-theme`
  * [#319](https://github.com/Shopify/slate/pull/319) Translation - customer.order.shipping_company updated to carrier. ([@paulmason](https://github.com/paulmason))
  * [#294](https://github.com/Shopify/slate/pull/294) Rte helpers fallback class. ([@NathanPJF](https://github.com/NathanPJF))
  * [#288](https://github.com/Shopify/slate/pull/288) Display the gift card's initial value. ([@maximevaillancourt](https://github.com/maximevaillancourt))
  * [#284](https://github.com/Shopify/slate/pull/284) Add parameters to RTE wrapper methods. ([@maximevaillancourt](https://github.com/maximevaillancourt))
  * [#281](https://github.com/Shopify/slate/pull/281) Tracking information for order page. ([@NathanPJF](https://github.com/NathanPJF))
  * [#280](https://github.com/Shopify/slate/pull/280) Add dutch locale. ([@driespieters](https://github.com/driespieters))

#### :bug: Bug Fix

* `slate-cli`
  * [#323](https://github.com/Shopify/slate/pull/323) Beautify settings files on migration. ([@maximevaillancourt](https://github.com/maximevaillancourt))
* `slate-tools`
  * [#318](https://github.com/Shopify/slate/pull/318) Fix Upload folder path in 'open:zip' gulp task. ([@maximevaillancourt](https://github.com/maximevaillancourt))
* `slate-theme`
  * [#313](https://github.com/Shopify/slate/pull/313) Update slate-theme with PT-pt. ([@gabrielajungblut](https://github.com/gabrielajungblut))
  * [#312](https://github.com/Shopify/slate/pull/312) Update slate-theme with reviewed copy for PT-br. ([@gabrielajungblut](https://github.com/gabrielajungblut))
  * [#287](https://github.com/Shopify/slate/pull/287) Auto-select the gift card's code on click. ([@maximevaillancourt](https://github.com/maximevaillancourt))

#### :house: Internal

* `slate-tools`
  * [#303](https://github.com/Shopify/slate/pull/303) Change dev script click event target from document to minimize button.([@Investopedia](https://github.com/Investopedia))
* `slate-theme`
  * [#300](https://github.com/Shopify/slate/pull/300) Correct some function comments. ([@Jore](https://github.com/Jore))
* Other
  * [#276](https://github.com/Shopify/slate/pull/276) Migrate to CircleCI 2. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 9

* Adrian Humphreys ([adrhumphreys](https://github.com/adrhumphreys))
* DriesP ([driespieters](https://github.com/driespieters))
* Joe Refoy ([Jore](https://github.com/Jore))
* Maxime Vaillancourt ([maximevaillancourt](https://github.com/maximevaillancourt))
* Nathan Ferguson ([NathanPJF](https://github.com/NathanPJF))
* Paul Mason ([paulmason](https://github.com/paulmason))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))
* [Investopedia](https://github.com/Investopedia)
* [gabrielajungblut](https://github.com/gabrielajungblut)

## v0.12.4 (2017-09-07)

#### :bug: Bug Fix

* `slate-theme`
  * [#275](https://github.com/Shopify/slate/pull/275) Fix search result item image liquid reference. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 1

* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v0.12.3 (2017-09-06)

#### :bug: Bug Fix

* `slate-theme`
  * [#272](https://github.com/Shopify/slate/pull/272) Fix a variable declaration typo in product.js. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 1

* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v0.12.2 (2017-08-30)

#### :bug: Bug Fix

* `slate-theme`
  * [#264](https://github.com/Shopify/slate/pull/264) Fix typo and variable declaration order in product.js. ([@saudslm](https://github.com/saudslm))

#### Committers: 1

* [saudslm](https://github.com/saudslm)

## v0.12.1 (2017-08-24)

#### :bug: Bug Fix

* Other
  * [#247](https://github.com/Shopify/slate/pull/247) Fix the output of slate-src.zip. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 1

* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## v0.12.0 (2017-08-24)

#### :rocket: Enhancement

* `slate-theme`
  * [#242](https://github.com/Shopify/slate/pull/242) add charset to stylesheet. ([@NathanPJF](https://github.com/NathanPJF))
  * [#207](https://github.com/Shopify/slate/pull/207) Adding danish translation. ([@madsobel](https://github.com/madsobel))
* `slate-tools`
  * [#236](https://github.com/Shopify/slate/pull/236) Persist theme preview bar minimize. ([@t-kelly](https://github.com/t-kelly))

#### :bug: Bug Fix

* `slate-theme`
  * [#239](https://github.com/Shopify/slate/pull/239) Fix behaviour and errors when no productimage. ([@t-kelly](https://github.com/t-kelly))
* `slate-tools`
  * [#240](https://github.com/Shopify/slate/pull/240) Ignore watching dot files in dist/ directory. ([@t-kelly](https://github.com/t-kelly))

#### :house: Internal

* `slate-cli`, `slate-theme`, `slate-tools`
  * [#212](https://github.com/Shopify/slate/pull/212) Combine all Slate repos into a single monorepo. ([@t-kelly](https://github.com/t-kelly))

#### Committers: 2

* Mads Obel ([madsobel](https://github.com/madsobel))
* Thomas Kelly ([t-kelly](https://github.com/t-kelly))

## [v0.11.0](https://github.com/Shopify/slate/tree/v0.11.0) (2017-07-19)

[Full Changelog](https://github.com/Shopify/slate/compare/v0.10.2...v0.11.0)

**Merged pull requests:**

* Docs new getting started [\#205](https://github.com/Shopify/slate/pull/205) ([NathanPJF](https://github.com/NathanPJF))
* Use @shopify/slate-tools v0.3.3 [\#203](https://github.com/Shopify/slate/pull/203) ([NathanPJF](https://github.com/NathanPJF))
* 0.11.0 [\#202](https://github.com/Shopify/slate/pull/202) ([NathanPJF](https://github.com/NathanPJF))
* Help users avoid resetting their theme data [\#201](https://github.com/Shopify/slate/pull/201) ([t-kelly](https://github.com/t-kelly))
* Update settings for header section [\#198](https://github.com/Shopify/slate/pull/198) ([t-kelly](https://github.com/t-kelly))
* Update normalize scss to v7 [\#194](https://github.com/Shopify/slate/pull/194) ([t-kelly](https://github.com/t-kelly))
* Add Jest for testing [\#193](https://github.com/Shopify/slate/pull/193) ([t-kelly](https://github.com/t-kelly))
* trapFocus\(\) - Replace eventNameSpace with namespace [\#187](https://github.com/Shopify/slate/pull/187) ([huguestennier](https://github.com/huguestennier))

## [v0.10.2](https://github.com/Shopify/slate/tree/v0.10.2) (2017-06-16)

[Full Changelog](https://github.com/Shopify/slate/compare/v0.10.1...v0.10.2)

**Merged pull requests:**

* add a sample gitignore [\#179](https://github.com/Shopify/slate/pull/179) ([NathanPJF](https://github.com/NathanPJF))
* Flushing cache [\#178](https://github.com/Shopify/slate/pull/178) ([NathanPJF](https://github.com/NathanPJF))
* Node version statement [\#175](https://github.com/Shopify/slate/pull/175) ([NathanPJF](https://github.com/NathanPJF))
* use product drop for detecting default variant [\#164](https://github.com/Shopify/slate/pull/164) ([NathanPJF](https://github.com/NathanPJF))
* Fix build tools doc [\#161](https://github.com/Shopify/slate/pull/161) ([chrisberthe](https://github.com/chrisberthe))

## [v0.10.1](https://github.com/Shopify/slate/tree/v0.10.1) (2017-05-26)

[Full Changelog](https://github.com/Shopify/slate/compare/v0.10.0...v0.10.1)

**Merged pull requests:**

* remove theme-support email, not theirs to support [\#163](https://github.com/Shopify/slate/pull/163) ([NathanPJF](https://github.com/NathanPJF))
* add changelog and changelog config [\#162](https://github.com/Shopify/slate/pull/162) ([NathanPJF](https://github.com/NathanPJF))
* Clean up and minify SVGs [\#158](https://github.com/Shopify/slate/pull/158) ([chrisberthe](https://github.com/chrisberthe))
* Remove old spec folder for Ruby i18n translation tests [\#157](https://github.com/Shopify/slate/pull/157) ([chrisberthe](https://github.com/chrisberthe))
* Modify checks for empty drops [\#156](https://github.com/Shopify/slate/pull/156) ([chrisberthe](https://github.com/chrisberthe))
* Update for accessible payment icons [\#155](https://github.com/Shopify/slate/pull/155) ([chrisberthe](https://github.com/chrisberthe))
* Update docs with yarn option [\#152](https://github.com/Shopify/slate/pull/152) ([macdonaldr93](https://github.com/macdonaldr93))
* Remove Extra 'two' in theme docs [\#151](https://github.com/Shopify/slate/pull/151) ([jgodson](https://github.com/jgodson))
* Add test command documentation [\#143](https://github.com/Shopify/slate/pull/143) ([chrisberthe](https://github.com/chrisberthe))
* Remove unused variable [\#140](https://github.com/Shopify/slate/pull/140) ([Jore](https://github.com/Jore))
* Fix typo [\#139](https://github.com/Shopify/slate/pull/139) ([Jore](https://github.com/Jore))
* Fixed a couple of broken links in docs. [\#137](https://github.com/Shopify/slate/pull/137) ([greenboyroy](https://github.com/greenboyroy))
* Change media mixin to media-query [\#136](https://github.com/Shopify/slate/pull/136) ([declank](https://github.com/declank))
* Small documentation edits [\#122](https://github.com/Shopify/slate/pull/122) ([RichardLitt](https://github.com/RichardLitt))
* add theme-lint, remove some gems [\#105](https://github.com/Shopify/slate/pull/105) ([NathanPJF](https://github.com/NathanPJF))

## [v0.10.0](https://github.com/Shopify/slate/tree/v0.10.0) (2017-04-19)

[Full Changelog](https://github.com/Shopify/slate/compare/v0.9.7...v0.10.0)

**Merged pull requests:**

* bump to version 0.10.0 [\#129](https://github.com/Shopify/slate/pull/129) ([NathanPJF](https://github.com/NathanPJF))
* document cart.js [\#128](https://github.com/Shopify/slate/pull/128) ([NathanPJF](https://github.com/NathanPJF))
* add to docs and section-js [\#125](https://github.com/Shopify/slate/pull/125) ([NathanPJF](https://github.com/NathanPJF))
* Docs theme scaffolding sass, js, and locales [\#124](https://github.com/Shopify/slate/pull/124) ([NathanPJF](https://github.com/NathanPJF))
* Fix broken license link in readme [\#119](https://github.com/Shopify/slate/pull/119) ([tiffanytse](https://github.com/tiffanytse))
* specifc -\> specific [\#118](https://github.com/Shopify/slate/pull/118) ([joshubrown](https://github.com/joshubrown))
* Add cart cookies disabled message [\#101](https://github.com/Shopify/slate/pull/101) ([ruairiphackett](https://github.com/ruairiphackett))
* add production env [\#84](https://github.com/Shopify/slate/pull/84) ([NathanPJF](https://github.com/NathanPJF))

## [v0.9.7](https://github.com/Shopify/slate/tree/v0.9.7) (2017-04-07)

[Full Changelog](https://github.com/Shopify/slate/compare/v0.9.5...v0.9.7)

**Merged pull requests:**

* bump slate-tools and slate-theme [\#115](https://github.com/Shopify/slate/pull/115) ([NathanPJF](https://github.com/NathanPJF))
* Add defaultTo function [\#114](https://github.com/Shopify/slate/pull/114) ([jonathanmoore](https://github.com/jonathanmoore))
* Compare at price logic [\#111](https://github.com/Shopify/slate/pull/111) ([NathanPJF](https://github.com/NathanPJF))
* Add product position [\#110](https://github.com/Shopify/slate/pull/110) ([NathanPJF](https://github.com/NathanPJF))
* add tracking for zip file [\#109](https://github.com/Shopify/slate/pull/109) ([NathanPJF](https://github.com/NathanPJF))
* Templates issues prs [\#107](https://github.com/Shopify/slate/pull/107) ([NathanPJF](https://github.com/NathanPJF))
* Readme consistency [\#106](https://github.com/Shopify/slate/pull/106) ([NathanPJF](https://github.com/NathanPJF))
* Clean up before making repo public. [\#104](https://github.com/Shopify/slate/pull/104) ([NathanPJF](https://github.com/NathanPJF))
* Progress bar fix slate tools [\#103](https://github.com/Shopify/slate/pull/103) ([NathanPJF](https://github.com/NathanPJF))

## [v0.9.5](https://github.com/Shopify/slate/tree/v0.9.5) (2017-03-01)

[Full Changelog](https://github.com/Shopify/slate/compare/v0.9.2...v0.9.5)

**Merged pull requests:**

* Version bump 0.9.5 [\#102](https://github.com/Shopify/slate/pull/102) ([NathanPJF](https://github.com/NathanPJF))
* Article comment status checking [\#100](https://github.com/Shopify/slate/pull/100) ([NathanPJF](https://github.com/NathanPJF))
* Use data attr selectors instead of class selectors [\#98](https://github.com/Shopify/slate/pull/98) ([NathanPJF](https://github.com/NathanPJF))
* add docs about section events and registering [\#94](https://github.com/Shopify/slate/pull/94) ([NathanPJF](https://github.com/NathanPJF))
* more detailed docs on variant JS [\#93](https://github.com/Shopify/slate/pull/93) ([NathanPJF](https://github.com/NathanPJF))
* Add documentation for migrate command [\#88](https://github.com/Shopify/slate/pull/88) ([cshold](https://github.com/cshold))
* Bump slate-tools version and patch [\#87](https://github.com/Shopify/slate/pull/87) ([stevebosworth](https://github.com/stevebosworth))
* Fix instance removal [\#85](https://github.com/Shopify/slate/pull/85) ([cshold](https://github.com/cshold))
* update slate-tools and version number [\#80](https://github.com/Shopify/slate/pull/80) ([stevebosworth](https://github.com/stevebosworth))
* add apple pay svg [\#79](https://github.com/Shopify/slate/pull/79) ([NathanPJF](https://github.com/NathanPJF))
* Remove Lodash dependency [\#78](https://github.com/Shopify/slate/pull/78) ([cshold](https://github.com/cshold))
* indentation on if-statements fix [\#77](https://github.com/Shopify/slate/pull/77) ([NathanPJF](https://github.com/NathanPJF))
* stronger contains check [\#76](https://github.com/Shopify/slate/pull/76) ([NathanPJF](https://github.com/NathanPJF))
* remove hardcoded strings [\#75](https://github.com/Shopify/slate/pull/75) ([NathanPJF](https://github.com/NathanPJF))
* \[docs\] clean up command descriptions [\#73](https://github.com/Shopify/slate/pull/73) ([NathanPJF](https://github.com/NathanPJF))
* \[docs\] explain how to get theme id [\#71](https://github.com/Shopify/slate/pull/71) ([NathanPJF](https://github.com/NathanPJF))
* add product variants link to JS examples sidebar [\#68](https://github.com/Shopify/slate/pull/68) ([NathanPJF](https://github.com/NathanPJF))
* \[Docs\] fix list formatting, change icons description [\#67](https://github.com/Shopify/slate/pull/67) ([NathanPJF](https://github.com/NathanPJF))
* \[Docs\] Fix broken HTML on js-examples [\#66](https://github.com/Shopify/slate/pull/66) ([cshold](https://github.com/cshold))
* \[Docs\] Fix iframe 301 redirects [\#65](https://github.com/Shopify/slate/pull/65) ([cshold](https://github.com/cshold))
* \[Docs\] Absolute paths for iframe src [\#63](https://github.com/Shopify/slate/pull/63) ([cshold](https://github.com/cshold))
* Fix formatting in js-examples [\#62](https://github.com/Shopify/slate/pull/62) ([chrisberthe](https://github.com/chrisberthe))
* \[Docs\] Update to relative urls [\#61](https://github.com/Shopify/slate/pull/61) ([cshold](https://github.com/cshold))
* \[Docs\] Active class for sidebar [\#60](https://github.com/Shopify/slate/pull/60) ([cshold](https://github.com/cshold))
* \[Docs\] Temporarily duplicate the slate styles for use in docs [\#59](https://github.com/Shopify/slate/pull/59) ([cshold](https://github.com/cshold))
* \[Docs\] Revert Jekyll config change [\#58](https://github.com/Shopify/slate/pull/58) ([cshold](https://github.com/cshold))
* \[Docs\] Move Jekyll config to root and add source [\#57](https://github.com/Shopify/slate/pull/57) ([cshold](https://github.com/cshold))
* \[Docs\] Switch from Jekyll to github-pages gem [\#55](https://github.com/Shopify/slate/pull/55) ([cshold](https://github.com/cshold))
* \[Docs\] Specify file extension for scss imports [\#54](https://github.com/Shopify/slate/pull/54) ([cshold](https://github.com/cshold))
* All the new docs [\#41](https://github.com/Shopify/slate/pull/41) ([cshold](https://github.com/cshold))

## [v0.9.2](https://github.com/Shopify/slate/tree/v0.9.2) (2016-11-29)

[Full Changelog](https://github.com/Shopify/slate/compare/v0.9.1...v0.9.2)

## [v0.9.1](https://github.com/Shopify/slate/tree/v0.9.1) (2016-11-24)

[Full Changelog](https://github.com/Shopify/slate/compare/v0.9.0...v0.9.1)

**Merged pull requests:**

* Deploy fixes and node_modules [\#53](https://github.com/Shopify/slate/pull/53) ([stevebosworth](https://github.com/stevebosworth))

## [v0.9.0](https://github.com/Shopify/slate/tree/v0.9.0) (2016-11-22)

**Merged pull requests:**

* updated slate-tools version [\#52](https://github.com/Shopify/slate/pull/52) ([stevebosworth](https://github.com/stevebosworth))
* Remove linting from CI tests [\#51](https://github.com/Shopify/slate/pull/51) ([cshold](https://github.com/cshold))
* Deploy js [\#50](https://github.com/Shopify/slate/pull/50) ([stevebosworth](https://github.com/stevebosworth))
* fix block scope issue [\#49](https://github.com/Shopify/slate/pull/49) ([stevebosworth](https://github.com/stevebosworth))
* fixed more node errors [\#47](https://github.com/Shopify/slate/pull/47) ([stevebosworth](https://github.com/stevebosworth))
* Deploy fix [\#46](https://github.com/Shopify/slate/pull/46) ([stevebosworth](https://github.com/stevebosworth))
* fix shipit deploy error [\#45](https://github.com/Shopify/slate/pull/45) ([stevebosworth](https://github.com/stevebosworth))
* fixes master select not updating [\#44](https://github.com/Shopify/slate/pull/44) ([stevebosworth](https://github.com/stevebosworth))
* Deploy unbuilt theme [\#43](https://github.com/Shopify/slate/pull/43) ([stevebosworth](https://github.com/stevebosworth))
* General cleanup and organization [\#40](https://github.com/Shopify/slate/pull/40) ([cshold](https://github.com/cshold))
* Remove old doc folder [\#39](https://github.com/Shopify/slate/pull/39) ([cshold](https://github.com/cshold))
* Force icons to inherit currentColor [\#38](https://github.com/Shopify/slate/pull/38) ([cshold](https://github.com/cshold))
* Add shipit deploys of built theme to S3 [\#36](https://github.com/Shopify/slate/pull/36) ([stevebosworth](https://github.com/stevebosworth))
* Fix a curved line in icon-arrow-down svg [\#34](https://github.com/Shopify/slate/pull/34) ([cshold](https://github.com/cshold))
* Add featured product as default section [\#33](https://github.com/Shopify/slate/pull/33) ([cshold](https://github.com/cshold))
* Slate product section [\#32](https://github.com/Shopify/slate/pull/32) ([cshold](https://github.com/cshold))
* fixes reference to old JS file [\#31](https://github.com/Shopify/slate/pull/31) ([stevebosworth](https://github.com/stevebosworth))
* Slate featured collection + collection list sections [\#30](https://github.com/Shopify/slate/pull/30) ([cshold](https://github.com/cshold))
* Cart discounts [\#29](https://github.com/Shopify/slate/pull/29) ([stevebosworth](https://github.com/stevebosworth))
* Switch to slate tools [\#28](https://github.com/Shopify/slate/pull/28) ([macdonaldr93](https://github.com/macdonaldr93))
* updated giftcard.js [\#27](https://github.com/Shopify/slate/pull/27) ([stevebosworth](https://github.com/stevebosworth))
* fixed linting errors [\#26](https://github.com/Shopify/slate/pull/26) ([stevebosworth](https://github.com/stevebosworth))
* Support js and js.liquid theme js [\#25](https://github.com/Shopify/slate/pull/25) ([cshold](https://github.com/cshold))
* Update to sections and variant js [\#24](https://github.com/Shopify/slate/pull/24) ([stevebosworth](https://github.com/stevebosworth))
* Remove ejs files. Temporary solution [\#23](https://github.com/Shopify/slate/pull/23) ([cshold](https://github.com/cshold))
* Sectionize header and footer [\#22](https://github.com/Shopify/slate/pull/22) ([cshold](https://github.com/cshold))
* New social sharing snippet [\#21](https://github.com/Shopify/slate/pull/21) ([cshold](https://github.com/cshold))
* Liquid cleanup [\#20](https://github.com/Shopify/slate/pull/20) ([cshold](https://github.com/cshold))
* Update vendor js build [\#18](https://github.com/Shopify/slate/pull/18) ([macdonaldr93](https://github.com/macdonaldr93))
* removed last of the single use snippets [\#17](https://github.com/Shopify/slate/pull/17) ([stevebosworth](https://github.com/stevebosworth))
* Switch to gulp-include for theme JS [\#16](https://github.com/Shopify/slate/pull/16) ([cshold](https://github.com/cshold))
* Remove duplicate dependencies [\#14](https://github.com/Shopify/slate/pull/14) ([macdonaldr93](https://github.com/macdonaldr93))
* Remove old onboarding states [\#13](https://github.com/Shopify/slate/pull/13) ([cshold](https://github.com/cshold))
* Turn linting off by default [\#8](https://github.com/Shopify/slate/pull/8) ([macdonaldr93](https://github.com/macdonaldr93))
* Toggle linting [\#7](https://github.com/Shopify/slate/pull/7) ([macdonaldr93](https://github.com/macdonaldr93))
* Fix single section files watch [\#6](https://github.com/Shopify/slate/pull/6) ([macdonaldr93](https://github.com/macdonaldr93))
* Move schema to bottom of compiled file [\#4](https://github.com/Shopify/slate/pull/4) ([macdonaldr93](https://github.com/macdonaldr93))
* Prevent the following of redirects for custom domains [\#3](https://github.com/Shopify/slate/pull/3) ([richgilbank](https://github.com/richgilbank))
* Fix path for build/watch on sections [\#2](https://github.com/Shopify/slate/pull/2) ([macdonaldr93](https://github.com/macdonaldr93))
* Version rev [\#1](https://github.com/Shopify/slate/pull/1) ([macdonaldr93](https://github.com/macdonaldr93))

\* _This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)_
