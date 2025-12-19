import type {DigitalAddressType} from '@open-formulieren/types';

import {get} from '@/api';
import {logError} from '@/components/Errors';

/**
 * @see `#/components/schemas/CommunicationPreferences` in the API spec.
 */
export interface CommunicationPreferences {
  type: DigitalAddressType;
  options: string[];
  preferred: string | null;
}

type FetchCommunicationPreferencesResult = CommunicationPreferences[];

type NormalizedCommunicationPreferences = Omit<CommunicationPreferences, 'preferred'> & {
  preferred: string;
};

export const fetchCommunicationPreferences = async (
  baseUrl: string,
  submissionId: string,
  componentKey: string
): Promise<NormalizedCommunicationPreferences[] | null> => {
  try {
    const result = await get<FetchCommunicationPreferencesResult>(
      `${baseUrl}prefill/plugins/customer-interactions/communication-preferences/${submissionId}/component/${componentKey}`
    );

    return result!.map(prefs => ({...prefs, preferred: prefs.preferred ?? ''}));
  } catch (error) {
    logError(error);
    return null;
  }
};
