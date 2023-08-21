import messagesEN from 'i18n/compiled/en.json';
import messagesNL from 'i18n/compiled/nl.json';
import {createIntl, createIntlCache} from 'react-intl';
import {z} from 'zod';

import {makeZodErrorMap} from './useZodErrorMap';

const cache = createIntlCache();
const intlEN = createIntl({locale: 'en', messages: messagesEN}, cache);
const intlNL = createIntl({locale: 'nl', messages: messagesNL}, cache);

const TEST_CASES = [
  {
    schema: z.string(),
    label: 'required',
    value: undefined,
    message: 'The required field is not filled out.',
  },
  {
    schema: z.string(),
    label: 'invalid_type',
    value: 420,
    message: 'Expected string, received number.',
  },
  {
    schema: z.literal('foo'),
    label: 'invalid_literal',
    value: 'bar',
    message: 'Invalid literal value, expected "foo".',
  },
  {
    schema: z.object({foo: z.string()}).strict(),
    label: 'unrecognized_keys',
    value: {foo: '', bar: '', baz: ''},
    message: "Unrecognized key(s) in object: 'bar', 'baz'.",
  },

  {
    schema: z.union([z.string(), z.number()]),
    label: 'invalid_union',
    value: true,
    message: 'Invalid input.',
  },
  {
    schema: z.discriminatedUnion('discriminator', [
      z.object({discriminator: z.literal('foo')}),
      z.object({discriminator: z.literal('bar')}),
    ]),
    label: 'invalid_union_discriminator',
    value: {discriminator: 'baz'},
    message: "Invalid discriminator value. Expected 'foo' | 'bar'.",
  },
  {
    schema: z.enum(['foo', 'bar']),
    label: 'invalid_enum_value',
    value: 'baz',
    message: "Invalid enum value. Expected 'foo' | 'bar', received baz.",
  },
  {
    schema: z.date(),
    label: 'invalid_date',
    value: new Date('2023-00-00'),
    message: 'Invalid date',
  },
  // strings
  {
    schema: z.string().includes('foo'),
    label: 'invalid_string::includes',
    value: 'bar',
    message: 'Invalid input: must include "foo".',
  },
  {
    schema: z.string().includes('foo', {position: 2}),
    label: 'invalid_string::includes with position',
    value: 'foobar',
    message:
      'Invalid input: must include "foo" at one or more positions greater than or equal to 2.',
  },
  {
    schema: z.string().startsWith('foo'),
    label: 'invalid_string::startsWith',
    value: 'bar',
    message: 'Invalid input: must start with "foo".',
  },
  {
    schema: z.string().endsWith('foo'),
    label: 'invalid_string::endsWith',
    value: 'bar',
    message: 'Invalid input: must end with "foo".',
  },
  {
    schema: z.string().email(),
    label: 'invalid_string::email',
    value: 'foo',
    message: 'Invalid email.',
  },
  {
    schema: z.string().ip(),
    label: 'invalid_string::ip',
    value: '300.172.16.3',
    message: 'Invalid IP address.',
  },
  {
    schema: z.string().regex(/[a-z]+/),
    label: 'invalid_string::regex',
    value: '42',
    message: 'Invalid.',
  },
  // too small
  {
    schema: z.array().min(1),
    label: 'too_small::array, inclusive',
    value: [],
    message: 'Array must contain at least 1 item.',
  },
  {
    schema: z.array().length(3),
    label: 'too_small::array, exactly',
    value: [],
    message: 'Array must contain exactly 3 items.',
  },
  {
    schema: z.string().min(1),
    label: 'too_small::string, inclusive',
    value: '',
    message: 'String must contain at least 1 character.',
  },
  {
    schema: z.string().length(3),
    label: 'too_small::string, exactly',
    value: 'fo',
    message: 'String must contain exactly 3 characters.',
  },
  {
    schema: z.number().gte(1),
    label: 'too_small::number, inclusive',
    value: 0,
    message: 'Number must be greater than or equal to 1.',
  },
  {
    schema: z.number().gt(3),
    label: 'too_small::number, exclusive',
    value: 3,
    message: 'Number must be greater than 3.',
  },
  {
    schema: z.date().min(new Date('2023-01-01')),
    label: 'too_small::date',
    value: new Date('2022-01-01'),
    message: 'Date must be greater than or equal to 1/1/2023.',
  },
  {
    schema: z.custom().superRefine((val, ctx) => {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 420,
        fatal: true,
      });
      return z.NEVER;
    }),
    label: 'too_small, generic',
    value: 42,
    message: 'Invalid input.',
  },
  // too big
  {
    schema: z.array(z.string()).max(0),
    label: 'too_big::array, inclusive',
    value: ['foo'],
    message: 'Array must contain at most 0 items.',
  },
  {
    schema: z.array(z.string()).length(3),
    label: 'too_big::array, exactly',
    value: ['foo', 'bar', 'baz', 'quux'],
    message: 'Array must contain exactly 3 items.',
  },
  {
    schema: z.string().max(1),
    label: 'too_big::string, inclusive',
    value: 'aaa',
    message: 'String must contain at most 1 character.',
  },
  {
    schema: z.string().length(3),
    label: 'too_big::string, exactly',
    value: 'fo',
    message: 'String must contain exactly 3 characters.',
  },
  {
    schema: z.number().lte(1),
    label: 'too_big::number, inclusive',
    value: 5,
    message: 'Number must be less than or equal to 1.',
  },
  {
    schema: z.number().lt(-273.15),
    label: 'too_big::number, exclusive',
    value: -273.0,
    message: 'Number must be less than -273.15.',
  },
  {
    schema: z.bigint().lt(-273),
    label: 'too_big::bigint, exclusive',
    value: -273n,
    message: 'BigInt must be less than -273.',
  },
  {
    schema: z.date().max(new Date('2022-01-01')),
    label: 'too_big::date',
    value: new Date('2023-01-01'),
    message: 'Date must be smaller than or equal to 1/1/2022.',
  },
  {
    schema: z.custom().superRefine((val, ctx) => {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 42,
        fatal: true,
      });
      return z.NEVER;
    }),
    label: 'too_big, generic',
    value: 420,
    message: 'Invalid input.',
  },
  // remaining special cases
  {
    schema: z.custom(v => false),
    label: 'custom',
    value: null,
    message: 'Invalid input.',
  },
  {
    schema: z.number().multipleOf(3),
    label: 'not_multiple_of',
    value: 10,
    message: 'Number must be a multiple of 3.',
  },
  {
    schema: z.number().finite(),
    label: 'not_finite',
    value: Infinity,
    message: 'Number must be finite.',
  },
];

describe('Localized global zod error map (EN)', () => {
  const errorMap = makeZodErrorMap(intlEN);

  it.each(TEST_CASES)(
    "correctly displays the '$label' error message",
    ({schema, value, message}) => {
      const result = schema.safeParse(value, {errorMap});

      expect(result.success).toBe(false);
      // we only expect one top level error in these tests
      const error = result.error.issues[0].message;
      expect(error).toBe(message);
    }
  );

  it("correctly displays the 'invalid_arguments' error message", () => {
    const strIdentity = z
      .function()
      .args(z.string())
      .returns(z.string())
      .implement(x => x);
    try {
      strIdentity(null);
    } catch (e) {
      const error = e.issues[0].message;
      expect(error).toBe('Invalid function arguments');
    }
  });

  it("correctly displays the 'invalid_return_type' error message", () => {
    const strIdentity = z
      .function()
      .args(z.string())
      .returns(z.string())
      .implement(x => null);
    try {
      strIdentity('foo');
    } catch (e) {
      const error = e.issues[0].message;
      expect(error).toBe('Invalid function return type');
    }
  });
});

describe('Localized global zod error map (NL)', () => {
  const errorMap = makeZodErrorMap(intlNL);

  it.each(TEST_CASES)("does not crash on translations ('$label')", ({schema, value}) => {
    const result = schema.safeParse(value, {errorMap});

    expect(result.success).toBe(false);
    // we only expect one top level error in these tests
    const error = result.error.issues[0].message;
    expect(error.length).toBeGreaterThan(0);
  });

  it("does not crash on translations ('invalid_arguments')", () => {
    const strIdentity = z
      .function()
      .args(z.string())
      .returns(z.string())
      .implement(x => x);
    try {
      strIdentity(null);
    } catch (e) {
      const error = e.issues[0].message;
      expect(error.length).toBeGreaterThan(0);
    }
  });

  it("does not crash on translations ('invalid_return_type')", () => {
    const strIdentity = z
      .function()
      .args(z.string())
      .returns(z.string())
      .implement(x => null);
    try {
      strIdentity('foo');
    } catch (e) {
      const error = e.issues[0].message;
      expect(error.length).toBeGreaterThan(0);
    }
  });
});
