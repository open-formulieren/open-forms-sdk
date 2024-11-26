// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import mswServer from 'api-mocks/msw-server';

beforeAll(() =>
  mswServer.listen({
    onUnhandledRequest: 'error',
  })
);
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
