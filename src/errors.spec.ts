import {ValidationError} from '@/errors';
import type {Http400ResponseBody} from '@/errors';

describe('ValidationError', () => {
  it('can expose the validation errors in a format for Formik', () => {
    const responseData: Http400ResponseBody = {
      code: 'nope',
      title: 'Nope',
      status: 400,
      detail: 'Data invalid',
      instance: 'urn:error:5092703a-9569-436a-ac15-22d6a6aa6889',
      invalidParams: [
        {
          name: 'topLevel',
          code: 'invalid',
          reason: 'The data was not valid.',
        },
        {
          name: 'parent.child',
          code: 'invalid',
          reason: 'A nested child is not valid.',
        },
        {
          name: 'someList.1.nested.child',
          code: 'invalid',
          reason: 'Sparse lists should be handled.',
        },
      ],
    };

    const validationError = new ValidationError('a message', responseData);

    const {initialTouched, initialErrors} = validationError.asFormikProps();

    expect(initialTouched).toEqual({
      topLevel: true,
      parent: {child: true},
      someList: [undefined, {nested: {child: true}}],
    });

    expect(initialErrors).toEqual({
      topLevel: 'The data was not valid.',
      parent: {child: 'A nested child is not valid.'},
      someList: [undefined, {nested: {child: 'Sparse lists should be handled.'}}],
    });
  });
});
