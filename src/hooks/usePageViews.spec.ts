import type {Location} from 'react-router';
import {afterEach, describe, expect, test, vi} from 'vitest';

import {ANALYTICS_PROVIDERS} from './usePageViews';

const buildLocation = (pathname: string, hash = '') =>
  ({
    pathname,
    hash,
    search: '',
    state: null,
    key: 'default',
  }) satisfies Location;

describe('Silktide analytics provider', () => {
  afterEach(() => {
    delete window.silktide;
  });

  test('does nothing if Silktide is not loaded', async () => {
    await expect(ANALYTICS_PROVIDERS.silktide(buildLocation('/form/start'), null)).resolves.toBe(
      undefined
    );
  });

  test('tracks client-side page loads', async () => {
    const silktide = vi.fn();
    window.silktide = silktide;

    await ANALYTICS_PROVIDERS.silktide(
      buildLocation('/formulier/stap/2', '#contactgegevens'),
      buildLocation('/formulier/stap/1', '#persoonlijke-gegevens')
    );

    expect(silktide).toHaveBeenCalledWith('page_load');
  });
});
