# Open Forms SDK

[![NPM package](https://img.shields.io/npm/v/@open-formulieren/sdk.svg)](https://www.npmjs.com/package/@open-formulieren/sdk)

The Open Forms SDK is the frontend to the [Open Forms backend][backend]. We publish it
as both an NPM library of components and pre-built [Docker image][docker].

The documentation is available [online][docs]. Note that the SDK documentation is
currently lacking. We're planning to publish Storybook documentation soon.

## Audience

The target audience for this library is developers who want to compose their own version
of the SDK without forking the repository.

Open Forms is developed as a white-label application, including the SDK. While the
UI components are fairly generic, there are more organization/theme-specific layouts
possible, requiring significant markup changes.

Rather than exposing and maintaining complex options for UI-component
customization, we decided to publish the SDK as a library so that (experienced)
developers can replace components as they need.

## Usage

The package exports two ways to use the library:

1. Importing and composing the invididual modules (ESM)
2. Importing the library as a whole

The former approach allows more fine-grained control and should exclude code/dependencies
that aren't used and result in smaller builds, while the latter gives you the public API
as it would be available in the browser.

Given the target audience, we expect developers to use option 1.

### Using individual modules

The underlying React components are published and can serve as a basis for your own
components, or even completely replace them (TODO - this is on the roadmap!).

E.g. to re-use the card component:

```jsx
import Card from '@openformulieren/sdk/components/Card';

const MyCard = (props) => (<Card titleComponent="h3" {...props} />);

export default MyCard;
```

**NOTE**: the published components are semi-private API. We cannot provide guarantees
that it will be 100% backwards-compatible. If we know breaking changes are made, we will
bump the major version number, but you should probably do extensive testing even with
minor versions.

**Exposed API**

The `package.json` describes the module exports, at the time of writing these are:

* `@openformulieren/sdk/components/*`
* `@openformulieren/sdk/hooks/*`
* `@openformulieren/sdk/types/*`
* `@openformulieren/sdk/map/*`
* `@openformulieren/sdk/sdk`
* `@openformulieren/sdk/utils`

These will be documented with Storybook at some point.

### Using the library

If you decide that using the SDK itself is sufficient, then your usage comes down to:

```js
import OpenForm, {
  ANALYTICS_PROVIDERS,
  Formio,
  Templates,
  OFLibrary,
  OpenFormsModule,
  setCSRFToken
} from '@open-formulieren/sdk';  // JS API
import '@open-formulieren/sdk/styles.css';  // import the (default) stylesheet

const form = new OpenForm(targetNode, options);
form.init();
```

[backend]: https://github.com/open-formulieren/open-forms
[docker]: https://hub.docker.com/r/openformulieren/open-forms-sdk
[docs]: https://open-forms.readthedocs.io/en/latest/
