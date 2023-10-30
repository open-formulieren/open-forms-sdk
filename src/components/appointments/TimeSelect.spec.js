import {jest} from '@jest/globals';
import {act, render as realRender, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Formik} from 'formik';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';

import {ConfigContext} from 'Context';
import {BASE_URL} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';

import {mockAppointmentTimesGet} from '../mocks';
import TimeSelect from './TimeSelect';

const products = [{productId: 'e8e045ab', amount: 1}];

const render = (comp, locationId) =>
  realRender(
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        displayComponents: {},
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <Formik
          initialValues={{
            location: locationId,
            date: '2023-06-14',
          }}
        >
          {comp}
        </Formik>
      </IntlProvider>
    </ConfigContext.Provider>
  );

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2023-06-12T14:00:00Z'));
  // Jest 28+
  // jest.useFakeTimers({
  //   advanceTimers: true,
  //   now: new Date('2023-06-12T14:00:00Z'),
  // });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('The appointment time select', () => {
  it('makes sure times are localized', async () => {
    const user = userEvent.setup({delay: null});
    mswServer.use(mockAppointmentTimesGet);

    render(<TimeSelect products={products} />, '1396f17c');
    const timeSelect = await screen.findByLabelText('Time');
    expect(timeSelect).toBeVisible();

    // open the options dropdown
    act(() => {
      timeSelect.focus();
    });
    await user.keyboard('[ArrowDown]');

    // see mocks.js for the returned times
    await waitFor(() => {
      expect(screen.getByText('08:00')).toBeVisible();
    });
    expect(screen.getByText('08:10')).toBeVisible();
    expect(screen.getByText('10:00')).toBeVisible();
    expect(screen.getByText('10:30')).toBeVisible();
    expect(screen.getByText('14:30')).toBeVisible();
  });
});
