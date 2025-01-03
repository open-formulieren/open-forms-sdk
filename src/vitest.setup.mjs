// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {Formio} from 'react-formio';

import mswServer from 'api-mocks/msw-server';

beforeAll(async () => {
  // set up HTTP mocks
  mswServer.listen({
    onUnhandledRequest: 'error',
  });

  // Use our custom components by registering the custom Formio module.
  // The import must be dynamic, otherwise vi.mock fails in tests...
  const OpenFormsModule = await import('formio/module');
  Formio.use(OpenFormsModule.default);
});
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
