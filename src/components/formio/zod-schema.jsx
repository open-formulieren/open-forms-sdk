/**
 * Minimal formio-component-to-zod-schema mapper.
 */
import {z} from 'zod';

const getSchema = (component, strict = true) => {
  const {validate = {}} = component;
  const isRequired = validate?.required ?? false;

  let schema;
  switch (component.type) {
    // textfield variants
    case 'email': {
      schema = z.string().email();
    }
    // eslint-disable-next-line no-fallthrough
    case 'bsn':
    case 'phoneNumber':
    case 'textfield': {
      schema = schema || z.string();

      const maxLength = validate?.maxLength;
      if (maxLength) {
        schema = schema.max(maxLength);
      }

      if (isRequired) {
        schema = schema.min(1);
      } else {
        schema = z.union([schema, z.literal('')]);
      }
      break;
    }

    // date/datetime variants
    case 'date': {
      schema = z.coerce.date();
      if (!isRequired) {
        schema = z.union([schema, z.literal('')]);
      }
      break;
    }

    // dropdown/multi variants
    case 'radio': {
      const possibleValues = component.values.map(opt => opt.value);
      schema = z.enum(possibleValues);
      break;
    }

    // unknown component type: don't validate
    default: {
      schema = strict ? z.never() : z.unknown();
    }
  }

  if (!isRequired) {
    schema = z.optional(schema);
  }
  return schema;
};

export default getSchema;
