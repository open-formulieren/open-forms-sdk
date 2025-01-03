// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {Formio} from 'react-formio';

import mswServer from 'api-mocks/msw-server';
// Use our custom components
import OpenFormsModule from 'formio/module';

beforeAll(() => {
  // set up HTTP mocks
  mswServer.listen({
    onUnhandledRequest: 'error',
  });

  // ensure our custom Formio module is registered
  Formio.use(OpenFormsModule);
});
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
