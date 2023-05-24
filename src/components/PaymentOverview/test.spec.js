import {render} from '@testing-library/react';
import messagesEN from 'i18n/compiled/en.json';
import React from 'react';
import {IntlProvider} from 'react-intl';
import {useLocation} from 'react-router-dom';
import {MemoryRouter} from 'react-router-dom';
import renderer from 'react-test-renderer';

import PaymentOverview from 'components/PaymentOverview';

/**
 * Set up mocks
 */
jest.mock('../../map/rd', () => jest.fn());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  Link: () => <a>some link</a>,
}));

const Wrap = ({children}) => (
  <IntlProvider locale="en" messages={messagesEN}>
    <MemoryRouter>{children}</MemoryRouter>
  </IntlProvider>
);

describe('navigation without context', () => {
  it('displays a generic error message', () => {
    useLocation.mockImplementation(() => ({
      pathname: 'localhost:3000/betaaloverzicht',
    }));
    const tree = renderer
      .create(
        <Wrap>
          <PaymentOverview />
        </Wrap>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('throws on unexpected values (status)', () => {
    useLocation.mockImplementation(() => ({
      pathname: 'localhost:3000/betaaloverzicht',
      state: {
        status: 'nope',
        userAction: 'accept',
      },
    }));

    expect(() =>
      render(
        <Wrap>
          <PaymentOverview />
        </Wrap>
      )
    ).toThrow();
  });

  it('throws on unexpected values (userAction)', () => {
    useLocation.mockImplementation(() => ({
      pathname: 'localhost:3000/betaaloverzicht',
      state: {
        status: 'completed',
        userAction: 'nope',
      },
    }));

    expect(() =>
      render(
        <Wrap>
          <PaymentOverview />
        </Wrap>
      )
    ).toThrow();
  });
});

describe('on valid redirect', () => {
  it('renders the status information', () => {
    useLocation.mockImplementation(() => ({
      pathname: 'localhost:3000/betaaloverzicht',
      state: {
        status: 'completed',
        userAction: 'accept',
      },
    }));

    const tree = renderer
      .create(
        <Wrap>
          <PaymentOverview />
        </Wrap>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders an error message on failure', () => {
    useLocation.mockImplementation(() => ({
      pathname: 'localhost:3000/betaaloverzicht',
      state: {
        status: 'failed',
        userAction: 'accept',
      },
    }));

    const tree = renderer
      .create(
        <Wrap>
          <PaymentOverview />
        </Wrap>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
