import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

export const UPLOAD_URL = `${BASE_URL}formio/fileupload`;
const TEMP_FILE_URL = `${BASE_URL}submissions/files`;

export const mockFileUploadPost = rest.post(UPLOAD_URL, (req, res, ctx) => {
  const body = {
    url: `${TEMP_FILE_URL}/c91173a5-7a62-40f3-8373-7c5ba83dfb17`,
    name: req.body.file.name,
    size: req.body.file.size,
  };
  return res(ctx.status(200), ctx.json(body));
});

export const mockFileUploadDelete = rest.delete(`${TEMP_FILE_URL}/:uuid`, (req, res, ctx) => {
  return res(ctx.status(204));
});

export const mockFileUploadErrorPost = (errors = []) =>
  rest.post(UPLOAD_URL, (req, res, ctx) => {
    return res(ctx.status(400), ctx.text(errors.join(' ')));
  });
