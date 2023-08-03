import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

import {PRIVACY_POLICY_ENDPOINT} from '.';

export const mockPrivacyPolicyConfigGet = rest.get(
  `${BASE_URL}${PRIVACY_POLICY_ENDPOINT}`,
  (req, res, ctx) =>
    res(
      ctx.json({
        requiresPrivacyConsent: true,
        privacyLabel:
          'I accept the privacy policy and consent to the processing of my personal data.',
      })
    )
);
