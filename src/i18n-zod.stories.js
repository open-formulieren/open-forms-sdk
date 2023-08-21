import {userEvent, within} from '@storybook/testing-library';
import {Form, Formik} from 'formik';
import {useIntl} from 'react-intl';
import {z} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import Button from 'components/Button';
import {EmailField, TextField} from 'components/forms';
import useZodErrorMap from 'hooks/useZodErrorMap';

export default {
  title: 'Private API / ZOD translations',
};

const TestComponent = ({email, number}) => {
  useZodErrorMap();
  const result = z
    .object({
      email: z.string().email(),
      number: z.number().min(10),
    })
    .safeParse({email, number});

  if (result.success) {
    return <div>Data validates</div>;
  }

  const formatted = result.error.format();
  return (
    <div className="utrecht-document">
      <p>Error messages should be in Dutch</p>

      <div>
        <strong>email errors</strong>
        <ul>
          {(formatted.email?._errors || []).map(err => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>number errors</strong>
        <ul>
          {(formatted.number?._errors || []).map(err => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const NLTranslations = {
  name: 'Dutch error messages',
  parameters: {
    locale: 'nl',
  },
  render: ({email, number}) => <TestComponent email={email} number={number} />,
  args: {
    email: undefined,
    number: 5,
  },
};

const AccessibleErrorsExample = ({onSubmit}) => {
  const intl = useIntl();
  useZodErrorMap();
  const labels = {
    name: 'Name',
    email: 'Email address',
  };
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const errorMap = (issue, ctx) => {
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type: {
        if (issue.received === z.ZodParsedType.undefined) {
          const fieldName = issue.path.join('.');
          const message = intl.formatMessage(
            {
              description: 'Required field error message',
              defaultMessage: '{field} is a required field.',
            },
            {field: labels[fieldName]}
          );
          return {message};
        }
      }
    }
    return {message: ctx.defaultError}; // use global schema as fallback
  };

  return (
    <Formik
      initialValues={{name: '', email: ''}}
      onSubmit={onSubmit}
      validationSchema={toFormikValidationSchema(schema, {errorMap})}
    >
      <Form>
        <TextField name="name" label={labels.name} />
        <EmailField name="email" label={labels.email} />
        <div
          className="openforms-form-control"
          style={{display: 'flex', justifyContent: 'flex-end'}}
        >
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export const LocalOverridePOC = {
  name: 'Accessible errors example',
  render: ({onSubmit}) => <AccessibleErrorsExample onSubmit={onSubmit} />,
  parameters: {locale: 'nl'},
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', {name: 'Submit'});

    await step('Submitting without input displays errors', async () => {
      await userEvent.click(submitButton);
      await canvas.findByText('Name is a required field.');
      await canvas.findByText('Email address is a required field.');
    });

    await step('Other validation errors fall back to global error map', async () => {
      const email = canvas.getByLabelText('Email address');
      await userEvent.type(email, 'invalid email');
      await canvas.findByText('Ongeldig e-mailadres.');
    });
  },
};
