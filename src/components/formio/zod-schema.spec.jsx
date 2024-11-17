import getSchema from './zod-schema';

describe('Form.io textfield component to zod-schema', () => {
  it('accepts string values', () => {
    const schema = getSchema({type: 'textfield', key: 'foo'});

    const result = schema.parse('a string');

    expect(result).toBe('a string');
  });

  it('validates max length', () => {
    const schema = getSchema({
      type: 'textfield',
      key: 'foo',
      validate: {maxLength: 3},
    });

    const valid = schema.parse('foo');
    expect(valid).toBe('foo');

    const {success, error} = schema.safeParse('too long');
    expect(success).toBe(false);
    expect(error.issues[0].code).toBe('too_big');
  });

  it('handles optional', () => {
    const optionalSchema = getSchema({type: 'textfield', key: 'foo'});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(true);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(true);
  });

  it('handles required', () => {
    const optionalSchema = getSchema({type: 'textfield', key: 'foo', validate: {required: true}});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(false);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(false);
  });
});

describe('Form.io bsn component to zod-schema', () => {
  it('accepts string values', () => {
    const schema = getSchema({type: 'bsn', key: 'foo'});

    const result = schema.parse('a string');

    expect(result).toBe('a string');
  });

  it('validates max length', () => {
    const schema = getSchema({
      type: 'bsn',
      key: 'foo',
      validate: {maxLength: 3},
    });

    const valid = schema.parse('foo');
    expect(valid).toBe('foo');

    const {success, error} = schema.safeParse('too long');
    expect(success).toBe(false);
    expect(error.issues[0].code).toBe('too_big');
  });

  it('handles optional', () => {
    const optionalSchema = getSchema({type: 'bsn', key: 'foo'});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(true);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(true);
  });

  it('handles required', () => {
    const optionalSchema = getSchema({type: 'bsn', key: 'foo', validate: {required: true}});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(false);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(false);
  });
});

describe('Form.io phoneNumber component to zod-schema', () => {
  it('accepts string values', () => {
    const schema = getSchema({type: 'phoneNumber', key: 'foo'});

    const result = schema.parse('a string');

    expect(result).toBe('a string');
  });

  it('validates max length', () => {
    const schema = getSchema({
      type: 'phoneNumber',
      key: 'foo',
      validate: {maxLength: 3},
    });

    const valid = schema.parse('foo');
    expect(valid).toBe('foo');

    const {success, error} = schema.safeParse('too long');
    expect(success).toBe(false);
    expect(error.issues[0].code).toBe('too_big');
  });

  it('handles optional', () => {
    const optionalSchema = getSchema({type: 'phoneNumber', key: 'foo'});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(true);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(true);
  });

  it('handles required', () => {
    const optionalSchema = getSchema({type: 'phoneNumber', key: 'foo', validate: {required: true}});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(false);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(false);
  });
});

describe('Form.io email component to zod-schema', () => {
  it('accepts email address values', () => {
    const schema = getSchema({type: 'email', key: 'foo'});

    const result = schema.parse('foo@example.com');

    expect(result).toBe('foo@example.com');
  });

  it('validates max length', () => {
    const schema = getSchema({
      type: 'email',
      key: 'foo',
      validate: {maxLength: 20},
    });

    const valid = schema.parse('foo@example.com');
    expect(valid).toBe('foo@example.com');

    const {success, error} = schema.safeParse('thisisvalidbuttoolong@example.com');
    expect(success).toBe(false);
    expect(error.issues[0].code).toBe('too_big');
  });

  it('handles optional', () => {
    const optionalSchema = getSchema({type: 'email', key: 'foo'});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(true);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(true);
  });

  it('handles required', () => {
    const optionalSchema = getSchema({type: 'email', key: 'foo', validate: {required: true}});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(false);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(false);
  });
});

describe('Form.io date component to zod-schema', () => {
  it('accepts ISO 8601 date values', () => {
    const schema = getSchema({type: 'date', key: 'foo'});

    const result = schema.parse('2023-07-10');

    expect(result).toBeInstanceOf(Date);
  });

  it('handles optional', () => {
    const optionalSchema = getSchema({type: 'date', key: 'foo'});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(true);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(true);
  });

  it('handles required', () => {
    const optionalSchema = getSchema({type: 'date', key: 'foo', validate: {required: true}});

    const result1 = optionalSchema.safeParse('');
    expect(result1.success).toBe(false);

    const result2 = optionalSchema.safeParse(undefined);
    expect(result2.success).toBe(false);
  });
});
