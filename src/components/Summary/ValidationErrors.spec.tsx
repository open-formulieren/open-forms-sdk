import {IntlProvider} from 'react-intl';
import {expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import messagesEN from '@/i18n/compiled/en.json';

import ValidationErrors from './ValidationErrors';
import type {ValidationErrorsProps} from './ValidationErrors';

// gh-6755 regression test
test('render validation errors for customer profile validation errors', async () => {
  const props: ValidationErrorsProps = {
    errors: {
      steps: [
        {
          nonFieldErrors: [],
          data: {profile: [{address: 'Invalid address format.'}]},
        },
      ],
    },
    summaryData: [
      {
        name: 'Step 1',
        slug: 'step-1',
        data: [
          {
            name: 'Profile',
            component: {
              id: '123',
              type: 'customerProfile',
              key: 'profile',
              label: 'Profile',
              digitalAddressTypes: ['email', 'phoneNumber'],
              shouldUpdateCustomerData: false,
            },
            value: [
              {type: 'email', address: '', preferenceUpdate: 'useOnlyOnce'},
              {type: 'phoneNumber', address: '020 123 456', preferenceUpdate: 'useOnlyOnce'},
            ],
          },
        ],
      },
    ],
  };

  const screen = await render(
    <IntlProvider locale="en" messages={messagesEN}>
      <ValidationErrors {...props} />
    </IntlProvider>
  );

  await expect.element(screen.getByText('Invalid address format.')).toBeVisible();
});

test('render validation errors for components with dots in their keys', async () => {
  const props: ValidationErrorsProps = {
    errors: {
      steps: [
        {
          nonFieldErrors: [],
          data: {parent: {child: 'A problem reported by the backend!'}},
        },
      ],
    },
    summaryData: [
      {
        name: 'Step 1',
        slug: 'step-1',
        data: [
          {
            name: 'Text',
            component: {
              id: '123',
              type: 'textfield',
              key: 'parent.child',
              label: 'Text',
            },
            value: 'Invalid value according to the backend',
          },
        ],
      },
    ],
  };

  const screen = await render(
    <IntlProvider locale="en" messages={messagesEN}>
      <ValidationErrors {...props} />
    </IntlProvider>
  );

  await expect.element(screen.getByText('A problem reported by the backend!')).toBeVisible();
});
