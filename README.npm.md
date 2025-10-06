# Open Forms SDK

[![NPM package](https://img.shields.io/npm/v/@open-formulieren/sdk.svg)](https://www.npmjs.com/package/@open-formulieren/sdk)
[![Coverage](https://codecov.io/github/open-formulieren/open-forms-sdk/branch/main/graphs/badge.svg?branch=main)](https://codecov.io/gh/open-formulieren/open-forms-sdk)
[![Storybook](https://img.shields.io/badge/docs-Storybook-FF4785?style=flat)](https://open-formulieren.github.io/open-forms-sdk/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

The Open Forms SDK is the frontend to the [Open Forms backend][backend]. We publish it as both an
NPM library of components and pre-built [Docker image][docker].

The documentation is available [online][docs]. The SDK documentation is available in our Storybook.

## Audience

The target audience for this library is developers who want to embed the SDK into their own frontend
bundles, and users that may want to use our SDK implementation in their storybook for documentation
and visual regression testing.

## Usage

The package exports two ways to use the library:

1. Importing and composing the invididual modules (ESM, recommended)
2. Importing the library as a whole (ESM or UMD bundle)

The former approach allows more fine-grained control and should exclude code/dependencies that
aren't used and result in smaller builds, while the latter gives you the public API as it would be
available in the browser.

Given the target audience, we expect developers to use option 1.

### Using the library

If you decide that using the SDK itself is sufficient, then your usage comes down to:

```js
// JS API
import {ANALYTICS_PROVIDERS, OpenForm, VERSION} from '@open-formulieren/sdk';
// import the (default) stylesheet
import '@open-formulieren/sdk/styles.css';

const form = new OpenForm(targetNode, options);
form.init();
```

### Embedding in Storybook

See our
[dedicated external Storybook integration docs](https://open-formulieren.github.io/open-forms-sdk/?path=/docs/developers-external-storybook--docs).

[backend]: https://github.com/open-formulieren/open-forms
[docker]: https://hub.docker.com/r/openformulieren/open-forms-sdk
[docs]: https://open-forms.readthedocs.io/en/latest/
