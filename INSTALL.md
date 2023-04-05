# Open Forms Javascript SDK

The Open Forms Javascript SDK enables users to embed, render and submit forms defined
in Open Forms.

The SDK leverages the Open Forms API, and is built on top of the
[formio.js SDK](https://github.com/formio/formio.js/)

Useful links:

* [Open Forms](https://github.com/maykinmedia/open-forms)

## Quickstart

Ensure you have the backend project running and add `CORS_ALLOWED_ORIGINS=http://localhost:3000` to your `.env` file
otherwise you will get CORS errors.

Clone this repository, and create/edit `.env.local` for your needs:

```
REACT_APP_BASE_API_URL=http://localhost:8000/api/v2/
REACT_APP_FORM_ID=93c09209-5fb9-4105-b6bb-9d9f0aa6782c
REACT_APP_USE_HASH_ROUTING=false
```

Initialize or update the submodules:

```bash
git submodule update --init
```

You get the form ID from the django admin.

Install dependencies & start the dev server for the SPA:

```
yarn install
yarn start
```

Note that this project is only a SPA for ease of development, it will become an NPM
package later.

## Dependencies

Ensure you have [Yarn](https://yarnpkg.com/) on your system.

## Working with design tokens

The Open Forms design tokens are tracked in a git submodule `design-tokens`. If you are
actively modifying design tokens, it's advised to run the watcher to build for changes
in a separate shell (or tab):

```bash
cd design-tokens
npm start
```

Build artifacts are emitted into the `dist/` folder, which is watched by the SDK
build chain, so changes in `design-tokens` result in recompiled SDK builds.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
