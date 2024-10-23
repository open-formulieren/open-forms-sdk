import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

export const UPLOAD_URL = `${BASE_URL}formio/fileupload`;
const TEMP_FILE_URL = `${BASE_URL}submissions/files`;

export const mockFileUploadPost = http.post(UPLOAD_URL, async ({request}) => {
  const formData = await request.formData();
  const file = formData.get('file');
  const body = {
    url: `${TEMP_FILE_URL}/c91173a5-7a62-40f3-8373-7c5ba83dfb17`,
    name: file.name,
    size: file.size,
  };
  return HttpResponse.json(body);
});

export const mockFileUploadDelete = http.delete(`${TEMP_FILE_URL}/:uuid`, () => {
  return new HttpResponse(null, {status: 204});
});

export const mockFileUploadErrorPost = (errors = []) =>
  http.post(UPLOAD_URL, () => {
    return new HttpResponse(errors.join(' '), {status: 400});
  });
