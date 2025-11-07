import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

export const UPLOAD_URL = `${BASE_URL}formio/fileupload`;
const TEMP_FILE_URL = `${BASE_URL}submissions/files`;

export const mockFileUploadPost = http.post(UPLOAD_URL, async ({request}) => {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return new HttpResponse('No file uploaded.', {status: 400});
  }

  // when using undici File (which we must in NodeJS), the `file` actually gets
  // interpreted as string type and things are very off. So we can't type narrow based
  // on instanceof or typeof constructs. The proper solution is to migrate to Vitest
  // browser mode.
  const {name, size} = file as File;

  const body = {
    url: `${TEMP_FILE_URL}/${window.crypto.randomUUID()}`,
    name,
    size,
  };
  return HttpResponse.json(body);
});

export const mockFileUploadDelete = http.delete(`${TEMP_FILE_URL}/:uuid`, () => {
  return new HttpResponse(null, {status: 204});
});

export const mockFileUploadErrorPost = (errors: string[] = []) =>
  http.post(UPLOAD_URL, () => {
    return new HttpResponse(errors.join(' '), {status: 400});
  });

export const mockFileUpload413Post = http.post(UPLOAD_URL, () => {
  return HttpResponse.json(
    {
      detail: 'Request entity too large.',
    },
    {status: 413}
  );
});
