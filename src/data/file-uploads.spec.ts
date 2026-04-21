import {expect, test} from 'vitest';

import {BASE_URL, buildSubmission} from '@/api-mocks';
import {
  mockFileUpload413Post,
  mockFileUploadErrorPost,
  mockFileUploadPost,
} from '@/api-mocks/file-uploads';
import mswWorker from '@/api-mocks/msw-worker';

import {createTemporaryFileUpload} from './file-uploads';

test('uploading valid data returns success response', async () => {
  mswWorker.use(mockFileUploadPost);
  const submission = buildSubmission();
  const file: File = new File(['filedata'], 'file.txt', {type: 'text/plain'});

  const result = await createTemporaryFileUpload(BASE_URL, submission, file);

  expect(result.result).toBe('success');
  if (result.result !== 'success') return;
  expect(result.url.startsWith(BASE_URL)).toBe(true);
});

test('uploading invalid data returns 400 error response', async () => {
  mswWorker.use(mockFileUploadErrorPost(['Simulated backend error.', 'Other error.']));
  const submission = buildSubmission();
  const file: File = new File(['filedata'], 'file.txt', {type: 'text/plain'});

  const result = await createTemporaryFileUpload(BASE_URL, submission, file);

  expect(result.result).toBe('failed');
  if (result.result !== 'failed') return;
  expect(result.errors).toEqual(['Simulated backend error. Other error.']);
});

test('uploading invalid data returns 413 error response', async () => {
  mswWorker.use(mockFileUpload413Post);
  const submission = buildSubmission();
  const file: File = new File(['filedata'], 'file.txt', {type: 'text/plain'});

  const result = await createTemporaryFileUpload(BASE_URL, submission, file);

  expect(result.result).toBe('failed');
  if (result.result !== 'failed') return;
  expect(result.errors).toEqual(['Request entity too large.']);
});
