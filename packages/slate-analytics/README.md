# @shopify/slate-analytics

Emits Slate usage events, performance data, and errors to Shopify analytics platform. Also manages user consent for collecting data while using Slate.

Consent is always asked for new users or if the data we collect has changed and may result in a potential change in concent. The goal of Slate analytics is to collect non-sensitive, real user metrics which will be used to improve Slate's development experience.

### Data Collected

All emmited events include a [performance.mark()](https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_mark_name) for benchmarking and randomly generated process ID for linking multiple events from the same command.

We will be continually iterating Slate Analytics to catch as many errors as possible. We will not collect full stack of errors which might contain sensitive information about a user's file system.

#### slate-analytics

| Name                                 | Payload                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| slate-analytics:new-user             | Contents of ~/.slaterc file (Randomly generated user ID, Email, Tracking consent version) |
| slate-analytics:renew-consent-prompt | Contents of ~/.slaterc file                                                               |
| slate-analytics:renew-consent-true   | Contents of ~/.slaterc file                                                               |

#### create-slate-theme

| Name                       | Payload                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| create-slate-theme:start   | Starter theme used, skipInstall flag value, verbose flag value, version of create-slate-theme |
| create-slate-theme:success | version of create-slate-theme                                                                 |

#### slate-tools

| Name                                | Payload                                     |
| ----------------------------------- | ------------------------------------------- |
| slate-tools:cli:start               | slate.config.js, slate-tools version        |
| slate-tools:build:start             | Webpack config, slate-tools version         |
| slate-tools:build:end               | Webpack config, slate-tools version         |
| slate-tools:deploy:start            | slate-tools version                         |
| slate-tools:deploy:end              | slate-tools version                         |
| slate-tools:deploy:error            | slate-tools version, error                  |
| slate-tools:deploy:main-theme       |                                             |
| slate-tools:start:start             | Webpack config, slate-tools version         |
| slate-tools:start:compile-errors    | slate-tools version, errors                 |
| slate-tools:start:compile-warnings  | slate-tools version, warnings, compile time |
| slate-tools:start:compile-success   | slate-tools version, compile time           |
| slate-tools:start:skip-first-deploy | slate-tools version                         |
| slate-tools:start:sync-start        | slate-tools version                         |
| slate-tools:start:sync-end          | slate-tools version                         |
| slate-tools:start:sync-error        | slate-tools version                         |
| slate-tools:zip:start               | slate-tools version                         |
