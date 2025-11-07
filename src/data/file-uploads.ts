import {apiCall, destroy} from '@/api';
import type {ApiCallOptions} from '@/api';

import type {Submission} from './submissions';

/**
 * @see `#/components/schemas/TemporaryFileUpload` in the API spec.
 */
export interface TemporaryFileUploadResponse {
  /**
   * The API resource URL pointing to the temporary file upload.
   */
  url: string;
  /**
   * File name.
   */
  name: string;
  /**
   * File size, in bytes.
   */
  size: number;
}

interface SuccessfulUploadResult {
  result: 'success';
  /**
   * The temporary file upload API resource URL.
   */
  url: string;
}

interface FailedUploadResult {
  result: 'failed';
  errors: string[];
}

type TemporaryFileUploadResult = SuccessfulUploadResult | FailedUploadResult;

const uploadStatusCheck = async (response: Response): Promise<void> => {
  if (!response.ok) throw response;
};

/**
 * Upload a file to the backend, creating a temporary file upload instance.
 *
 * The backend may respond with an HTTP 400 status, containing server-side validation
 * errors. It's also possible other 4xx or 5xx errors are encountered, e.g. if the file
 * is too large and is rejected by the web server (HTTP 413).
 */
export const createTemporaryFileUpload = async (
  baseUrl: string,
  submission: Submission,
  file: File
): Promise<TemporaryFileUploadResult> => {
  const endpoint = `${baseUrl}formio/fileupload`;

  const formData = new FormData();
  formData.append('submission', submission.url);
  formData.append('file', file);

  // we need low-level access to window.fetch because we're doing plain
  // multipart/form-data rather than JSON for file uploads.
  const opts: ApiCallOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain',
    },
    body: formData,
  };

  try {
    const response = await apiCall(endpoint, opts, uploadStatusCheck);
    const responseData: TemporaryFileUploadResponse = await response.json();
    return {
      result: 'success',
      url: responseData.url,
    };
  } catch (err: unknown) {
    if (!(err instanceof Response)) throw err; // re-throw
    const response = err;

    let errorMessage: string = 'Unknown error.';
    switch (response.status) {
      case 400: {
        errorMessage = await response.text();
        break;
      }
      default: {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const responseData = await response.json();
          errorMessage = responseData.detail;
        }
      }
    }

    return {
      result: 'failed',
      errors: [errorMessage],
    };
  }
};

export const destroyTemporaryFileUpload = async (url: string): Promise<void> => {
  await destroy(url);
};
