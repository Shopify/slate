# Slate
Shopify Theme Building toolset. Forked from the now defunct [Shopify/slate](https://github.com/Shopify/slate)

## Purpose
Shopify's standard theme offerings are limited to what Shopify's platform can offer. Typically this includes;
- Vanilla JS
- Vanilla HTML
- Shopify's Server Side Liquid Templating Language
- Shopify's Storefront API
- Shopify's JS API
- Shopify's now deprecated SCSS/Liquid SCSS interpreter

Slate's primary purpose is to do precompilation and bundling to facilitate some more modern tools, languages and features to be used, our main focus for continuing this package is to;
- Allow for modern programming tools, languages and features (ESNext, SCSS, TypeScript, WebComponents, etc.)
- Improve page load times and speed by minifying and compiling code prior to upload
- Decrease dev time and speed up processes caused by slower theme changes
- Standardize tools, styling and code bases in the Shopify space.
- Help to strengthen the Shopify community as a whole

## Improvements over Slate-v1x
In the time I have been working on Slate since Slate v1 was deprecated the following features have been added or changed;
- Native TypeScript support for the webpack
- Updated dependencies to 2020
- Updated ThemeKit to allow for new hash based syncing
- Fixed some known bugs
- Overall reduced the output to the terminal that wasn't necessary to allow you to focus on what's happening
- Sections and Snippet Sub-Directories

## Planned Features and Goals
Currently this fork of slate is focused on *standardizing* and *improving* slate, prior to adding any new features. Some changes may seem counter intuitive but the overarching goal is to bring all code bases in line with each other.

- Fix known bugs 🔥
- Built in skeleton theme to make a standard starting point
- Updated slate-tools to TypeScript to make tool development easier
- Improve the CI process for collaborators
- Bring back the ability to customize the webpack configuration
- Improve code minification
- Remove dependencies to make node_module install time faster
- Only update *.js, *.map and *.(s)css files when changes occur to decrease deploy time between production and development
- Built in Storefront API client with dynamic TypeScript definitions
- Better Unit testing
- Slate Theme Unit Tester

## Contributing
I have yet to formalize the contributing process, for the time being if you need a feature or a change then submit an issue and if you want to contribute then create a pull-request and I'll review manually for the time being.
