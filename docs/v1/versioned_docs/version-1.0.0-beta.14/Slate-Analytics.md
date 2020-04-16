---
id: version-1.0.0-beta.14-slate-analytics
title: Slate analytics
original_id: slate-analytics
---

Slate Analytics emits Slate usage events, performance data, and errors to the Shopify analytics platform. It also manages individual user consent for collecting data as they work with Slate.

Consent is always asked for new Slate users and if the data we collect has changed in a way that requires a consent reconfirmation. The goal of Slate analytics is to collect non-sensitive, real user metrics which will be used to improve Slate's development experience.

## Data Collected

All emitted events include a [performance.mark()](https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_mark_name) for benchmarking and randomly generated process ID for linking multiple events from the same command.

We will be continually iterating Slate Analytics to catch as many errors as possible. We will **never** collect a full stack of errors, which may contain sensitive information about the user's file system.

### slate-analytics

| Name                                   | Payload                                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| `slate-analytics:new-user`             | Contents of `~/.slaterc` (Randomly generated user ID, Email, Tracking consent version)` |
| `slate-analytics:renew-consent-prompt` | Contents of `~/.slaterc`                                                                |
| `slate-analytics:renew-consent-true`   | Contents of `~/.slaterc`                                                                |

### create-slate-theme

| Name                         | Payload                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `create-slate-theme:start`   | Starter theme used, `--skipInstall` value, `--verbose` flag value, create-slate-theme version |
| `create-slate-theme:success` | `create-slate-theme` version                                                                  |

### slate-tools

| Name                                  | Payload                                       |
| ------------------------------------- | --------------------------------------------- |
| `slate-tools:cli:start`               | `slate.config.js`, `slate-tools` version      |
| `slate-tools:build:start`             | Webpack config, `slate-tools` version         |
| `slate-tools:build:end`               | Webpack config, `slate-tools` version         |
| `slate-tools:deploy:start`            | `slate-tools` version                         |
| `slate-tools:deploy:end`              | `slate-tools` version                         |
| `slate-tools:deploy:error`            | `slate-tools` version, error                  |
| `slate-tools:deploy:main-theme`       |                                               |
| `slate-tools:start:start`             | Webpack config, slate-tools version           |
| `slate-tools:start:compile-errors`    | `slate-tools` version, errors                 |
| `slate-tools:start:compile-warnings`  | `slate-tools` version, warnings, compile time |
| `slate-tools:start:compile-success`   | `slate-tools` version, compile time           |
| `slate-tools:start:skip-first-deploy` | `slate-tools` version                         |
| `slate-tools:start:sync-start`        | `slate-tools` version                         |
| `slate-tools:start:sync-end`          | `slate-tools` version                         |
| `slate-tools:start:sync-error`        | `slate-tools` version                         |
| `slate-tools:zip:start`               | `slate-tools` version                         |
