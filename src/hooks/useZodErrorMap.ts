import {type IntlShape, useIntl} from 'react-intl';
import {ZodIssueCode, ZodParsedType, util, z} from 'zod';

export const makeZodErrorMap = (intl: IntlShape): z.ZodErrorMap => {
  // taken and adapted from https://github.com/colinhacks/zod/blob/master/src/locales/en.ts
  const errorMap: z.ZodErrorMap = (issue, ctx) => {
    let message;

    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = intl.formatMessage({
            description: "ZOD 'required' error message",
            defaultMessage: 'The required field is not filled out.', // TODO: get the {{ field }} in here?
          });
        } else {
          message = intl.formatMessage(
            {
              description: "ZOD 'invalid_type' error message",
              defaultMessage: 'Expected {expected}, received {received}.',
            },
            {
              expected: issue.expected,
              received: issue.received,
            }
          );
        }
        break;
      case ZodIssueCode.invalid_literal:
        message = intl.formatMessage(
          {
            description: "ZOD 'invalid_literal' error message",
            defaultMessage: 'Invalid literal value, expected {expected}.',
          },
          {expected: JSON.stringify(issue.expected, util.jsonStringifyReplacer)}
        );
        break;
      case ZodIssueCode.unrecognized_keys:
        message = intl.formatMessage(
          {
            description: "ZOD 'unrecognized_keys' error message",
            defaultMessage: 'Unrecognized key(s) in object: {keys}.',
          },
          {keys: util.joinValues(issue.keys, ', ')}
        );
        break;
      case ZodIssueCode.invalid_union:
        message = intl.formatMessage({
          description: "ZOD 'invalid_union' error message",
          defaultMessage: 'Invalid input.',
        });
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = intl.formatMessage(
          {
            description: "ZOD 'invalid_union_discriminator' error message",
            defaultMessage: 'Invalid discriminator value. Expected {expected}.',
          },
          {
            expected: util.joinValues(issue.options),
          }
        );
        break;
      case ZodIssueCode.invalid_enum_value:
        message = intl.formatMessage(
          {
            description: "ZOD 'invalid_enum_value' error message",
            defaultMessage: 'Invalid enum value. Expected {expected}, received {received}.',
          },
          {
            expected: util.joinValues(issue.options),
            received: issue.received,
          }
        );
        break;
      case ZodIssueCode.invalid_arguments:
        message = intl.formatMessage({
          description: "ZOD 'invalid_arguments' error message",
          defaultMessage: 'Invalid function arguments',
        });
        break;
      case ZodIssueCode.invalid_return_type:
        message = intl.formatMessage({
          description: "ZOD 'invalid_return_type' error message",
          defaultMessage: 'Invalid function return type',
        });
        break;
      case ZodIssueCode.invalid_date:
        message = intl.formatMessage({
          description: "ZOD 'invalid_date' error message",
          defaultMessage: 'Invalid date',
        });
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === 'object') {
          if ('includes' in issue.validation) {
            message = intl.formatMessage(
              {
                description: "ZOD 'invalid_string' error message, with required include",
                defaultMessage: 'Invalid input: must include "{includes}".',
              },
              {includes: issue.validation.includes}
            );

            // eslint-disable-next-line max-depth
            if (typeof issue.validation.position === 'number') {
              message = intl.formatMessage(
                {
                  description:
                    "ZOD 'invalid_string' error message, with required include at specific position",
                  defaultMessage:
                    'Invalid input: must include "{includes}" at one or ' +
                    'more positions greater than or equal to {position}.',
                },
                {
                  includes: issue.validation.includes,
                  position: issue.validation.position,
                }
              );
            }
          } else if ('startsWith' in issue.validation) {
            message = intl.formatMessage(
              {
                description: "ZOD 'invalid_string' error message, with startsWith",
                defaultMessage: 'Invalid input: must start with "{startsWith}".',
              },
              {
                startsWith: issue.validation.startsWith,
              }
            );
          } else if ('endsWith' in issue.validation) {
            message = intl.formatMessage(
              {
                description: "ZOD 'invalid_string' error message, with endsWith",
                defaultMessage: 'Invalid input: must end with "{endsWith}".',
              },
              {
                endsWith: issue.validation.endsWith,
              }
            );
          } else {
            /* istanbul ignore next */
            util.assertNever(issue.validation);
          }
        } else if (issue.validation !== 'regex') {
          // See https://github.com/colinhacks/zod/blob/master/src/ZodError.ts#L91
          message = intl.formatMessage(
            {
              description: "ZOD 'invalid_string' error message, validation other than regex",
              defaultMessage: `
                  Invalid {validation, select,
                    email {email}
                    url {url}
                    datetime {date and time}
                    ip {IP address}
                    other {validation}
                  }.`,
            },
            {
              validation: issue.validation,
            }
          );
        } else {
          message = intl.formatMessage({
            description: "ZOD 'invalid_string' error message, regex validation",
            defaultMessage: 'Invalid.', // we don't have access to the pattern from the context
          });
        }
        break;
      case ZodIssueCode.too_small:
        if (issue.type === 'array')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_small' error message, for arrays",
              defaultMessage: `
                Array must contain {exact, select,
                  true {exactly}
                  other {{inclusive, select, true {at least} other {more than}}}
                } {minimum, plural, one {{minimum} item} other {{minimum} items}}.`,
            },
            {
              // @ts-expect-error react-intl doesn't support bigint yet
              minimum: issue.minimum,
              exact: issue.exact,
              inclusive: issue.inclusive,
            }
          );
        else if (issue.type === 'string')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_small' error message, for strings",
              defaultMessage: `
                String must contain {exact, select,
                  true {exactly}
                  other {{inclusive, select, true {at least} other {more than}}}
                } {minimum, plural, one {{minimum} character} other {{minimum} characters}}.`,
            },
            {
              // @ts-expect-error react-intl doesn't support bigint yet
              minimum: issue.minimum,
              exact: issue.exact,
              inclusive: issue.inclusive,
            }
          );
        else if (issue.type === 'number')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_small' error message, for numbers",
              defaultMessage: `
                Number must be {exact, select,
                  true {exactly equal to}
                  other {{inclusive, select, true {greater than or equal to} other {greater than}}}
                } {minimum}.`,
            },
            {
              minimum: intl.formatNumber(issue.minimum),
              exact: issue.exact,
              inclusive: issue.inclusive,
            }
          );
        else if (issue.type === 'date')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_small' error message, for dates",
              defaultMessage: 'Date must be greater than or equal to {minimum}.',
            },
            {
              minimum: intl.formatDate(new Date(Number(issue.minimum))),
            }
          );
        else {
          message = intl.formatMessage({
            description: "ZOD 'too_small' error message, generic",
            defaultMessage: 'Invalid input.',
          });
        }
        break;
      case ZodIssueCode.too_big:
        if (issue.type === 'array')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_big' error message, for arrays",
              defaultMessage: `
                Array must contain {exact, select,
                  true {exactly}
                  other {{inclusive, select, true {at most} other {less than}}}
                } {maximum, plural, one {{maximum} item} other {{maximum} items}}.`,
            },
            {
              // @ts-expect-error react-intl doesn't support bigint yet
              maximum: issue.maximum,
              exact: issue.exact,
              inclusive: issue.inclusive,
            }
          );
        else if (issue.type === 'string')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_big' error message, for strings",
              defaultMessage: `
                String must contain {exact, select,
                  true {exactly}
                  other {{inclusive, select, true {at most} other {under}}}
                } {maximum, plural, one {{maximum} character} other {{maximum} characters}}.`,
            },
            {
              // @ts-expect-error react-intl doesn't support bigint yet
              maximum: issue.maximum,
              exact: issue.exact,
              inclusive: issue.inclusive,
            }
          );
        else if (issue.type === 'number')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_big' error message, for numbers",
              defaultMessage: `
                Number must be {exact, select,
                  true {exactly equal to}
                  other {{inclusive, select, true {less than or equal to} other {less than}}}
                } {maximum}.`,
            },
            {
              maximum: intl.formatNumber(issue.maximum),
              exact: issue.exact,
              inclusive: issue.inclusive,
            }
          );
        else if (issue.type === 'bigint')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_big' error message, for BigInt",
              defaultMessage: `
                BigInt must be {exact, select,
                  true {exactly equal to}
                  other {{inclusive, select, true {less than or equal to} other {less than}}}
                } {maximum}.`,
            },
            {
              maximum: intl.formatNumber(issue.maximum),
              exact: issue.exact,
              inclusive: issue.inclusive,
            }
          );
        else if (issue.type === 'date')
          message = intl.formatMessage(
            {
              description: "ZOD 'too_big' error message, for dates",
              defaultMessage: 'Date must be smaller than or equal to {maximum}.',
            },
            {
              maximum: intl.formatDate(new Date(Number(issue.maximum))),
            }
          );
        else {
          message = intl.formatMessage({
            description: "ZOD 'too_big' error message, generic",
            defaultMessage: 'Invalid input.',
          });
        }
        break;
      case ZodIssueCode.custom:
        message = intl.formatMessage({
          description: "ZOD 'custom' error message",
          defaultMessage: 'Invalid input.',
        });
        break;
      /* istanbul ignore next */
      case ZodIssueCode.invalid_intersection_types:
        message = intl.formatMessage({
          description: "ZOD 'invalid_intersection_types' error message",
          defaultMessage: 'Intersection results could not be merged',
        });
        break;
      case ZodIssueCode.not_multiple_of:
        message = intl.formatMessage(
          {
            description: "ZOD 'not_multiple_of' error message",
            defaultMessage: 'Number must be a multiple of {multipleOf}.',
          },
          {
            multipleOf: intl.formatNumber(issue.multipleOf),
          }
        );
        break;
      case ZodIssueCode.not_finite:
        message = intl.formatMessage({
          description: "ZOD 'not_finite' error message",
          defaultMessage: 'Number must be finite.',
        });
        break;
      /* istanbul ignore next */
      default:
        message = ctx.defaultError;
        util.assertNever(issue);
    }
    return {message};
  };

  return errorMap;
};

const useZodErrorMap = (): void => {
  const intl = useIntl();
  z.setErrorMap(makeZodErrorMap(intl));
};

export default useZodErrorMap;
