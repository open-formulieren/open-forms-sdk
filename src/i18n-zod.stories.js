import {z} from 'zod';

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
