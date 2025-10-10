import {act, render as realRender, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Formik} from 'formik';
import {IntlProvider} from 'react-intl';

import {ConfigContext} from '@/Context';
import {BASE_URL} from '@/api-mocks';
import {mockAppointmentDatesGet} from '@/api-mocks/appointments';
import mswServer from '@/api-mocks/msw-server';
import type {AppointmentProduct} from '@/data/appointments';
import messagesEN from '@/i18n/compiled/en.json';

import DateSelect from './DateSelect';

const waitForPosition = () => act(async () => {});

const products: AppointmentProduct[] = [{productId: 'e8e045ab', amount: 1}];

const render = (children: React.ReactNode, locationId: string) =>
  realRender(
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        basePath: '',
        clientBaseUrl: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        debug: false,
        backToTopText: '',
        backToTopRef: '',
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <Formik
          initialValues={{
            location: locationId,
            date: '',
          }}
          onSubmit={vi.fn()}
        >
          {children}
        </Formik>
      </IntlProvider>
    </ConfigContext.Provider>
  );

beforeEach(() => {
  vi.setSystemTime(new Date('2023-06-12T14:00:00Z'));
});

describe('The appointment date select', () => {
  it('disables dates before and after the available dates range', async () => {
    const user = userEvent.setup();
    mswServer.use(mockAppointmentDatesGet);

    render(<DateSelect products={products} />, '1396f17c');

    const input = screen.getByLabelText('Date');
    await waitFor(() => expect(input).not.toBeDisabled());

    await user.click(input);
    await waitForPosition();

    expect(input).toHaveFocus();
    expect(await screen.findByRole('dialog')).toBeVisible();

    expect(await screen.findByRole('button', {name: 'Monday 12 June 2023'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Tuesday 13 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Wednesday 14 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Thursday 15 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Friday 16 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Saturday 17 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Sunday 18 June 2023'})).toBeDisabled();
  });

  it('disables missing dates within the available dates range', async () => {
    const user = userEvent.setup({delay: null});
    mswServer.use(mockAppointmentDatesGet);

    render(<DateSelect products={products} />, '34000e85');

    const input = screen.getByLabelText('Date');
    await waitFor(() => expect(input).not.toBeDisabled());

    await user.click(input);
    await waitForPosition();

    expect(input).toHaveFocus();
    expect(await screen.findByRole('dialog')).toBeVisible();

    expect(await screen.findByRole('button', {name: 'Monday 12 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Tuesday 13 June 2023'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Wednesday 14 June 2023'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Thursday 15 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Friday 16 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Saturday 17 June 2023'})).not.toBeDisabled();
    expect(screen.getByRole('button', {name: 'Sunday 18 June 2023'})).toBeDisabled();
  });
});
