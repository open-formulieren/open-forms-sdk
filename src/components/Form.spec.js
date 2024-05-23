import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm, mockAnalyticsToolConfigGet} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {mockSubmissionPost} from 'api-mocks/submissions';
import {routes} from 'components/App';

const Wrapper = ({form}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/startpagina'],
    initialIndex: 0,
  });

  return (
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        // clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        displayComponents: {},
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <FormContext.Provider value={form}>
          <RouterProvider router={router} />
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

describe('Start form', () => {
  it('Start form anonymously', async () => {
    const user = userEvent.setup();
    mswServer.use(mockSubmissionPost(), mockAnalyticsToolConfigGet());
    let startSubmissionRequest;
    mswServer.events.on('request:match', async request => {
      if (request.method === 'POST' && request.url.pathname.endsWith('/api/v2/submissions')) {
        startSubmissionRequest = request;
      }
    });
    // form with only anonymous login option
    const form = buildForm({loginOptions: [], loginRequired: false});

    render(<Wrapper form={form} />);

    await waitForElementToBeRemoved(() => screen.getByRole('status'));

    const startButton = screen.getByRole('button', {name: 'Begin'});
    await user.click(startButton);

    expect(startSubmissionRequest).not.toBeUndefined();
    const requestBody = await startSubmissionRequest.json();
    expect(requestBody.anonymous).toBe(true);
  });
});
