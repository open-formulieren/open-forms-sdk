import {File as NodeFile} from 'undici';

import {BASE_URL, buildSubmission} from '@/api-mocks';
import {
  mockFileUpload413Post,
  mockFileUploadErrorPost,
  mockFileUploadPost,
} from '@/api-mocks/file-uploads';
import mswServer from '@/api-mocks/msw-server';

import {createTemporaryFileUpload} from './file-uploads';

test('uploading valid data returns success response', async () => {
  mswServer.use(mockFileUploadPost);
  const submission = buildSubmission();
  // More info: https://mswjs.io/docs/faq#requestresponsetextencoder-is-not-defined-jest
  // @ts-expect-error we use a different File implementation because jsdom mock suck
  const file: File = new NodeFile(['filedata'], 'file.txt', {type: 'text/plain'});

  const result = await createTemporaryFileUpload(BASE_URL, submission, file);

  expect(result.result).toBe('success');
  if (result.result !== 'success') return;
  expect(result.url.startsWith(BASE_URL)).toBe(true);
});

test('uploading invalid data returns 400 error response', async () => {
  mswServer.use(mockFileUploadErrorPost(['Simulated backend error.', 'Other error.']));
  const submission = buildSubmission();
  // More info: https://mswjs.io/docs/faq#requestresponsetextencoder-is-not-defined-jest
  // @ts-expect-error we use a different File implementation because jsdom mock suck
  const file: File = new NodeFile(['filedata'], 'file.txt', {type: 'text/plain'});

  const result = await createTemporaryFileUpload(BASE_URL, submission, file);

  expect(result.result).toBe('failed');
  if (result.result !== 'failed') return;
  expect(result.errors).toEqual(['Simulated backend error. Other error.']);
});

test('uploading invalid data returns 413 error response', async () => {
  mswServer.use(mockFileUpload413Post);
  const submission = buildSubmission();
  // More info: https://mswjs.io/docs/faq#requestresponsetextencoder-is-not-defined-jest
  // @ts-expect-error we use a different File implementation because jsdom mock suck
  const file: File = new NodeFile(['filedata'], 'file.txt', {type: 'text/plain'});

  const result = await createTemporaryFileUpload(BASE_URL, submission, file);

  expect(result.result).toBe('failed');
  if (result.result !== 'failed') return;
  expect(result.errors).toEqual(['Request entity too large.']);
});
