import type {DigitalAddressType} from '@open-formulieren/types';

import {get} from '@/api';
import {logError} from '@/components/Errors';

export interface DigitalAddressGroup {
  type: DigitalAddressType;
  options: string[];
  preferred?: string;
}

type FetchCommunicationPreferencesResult = DigitalAddressGroup[];

export const fetchCommunicationPreferences = async (
  baseUrl: string,
  submissionId: string,
  componentKey: string
): Promise<FetchCommunicationPreferencesResult | null> => {
  try {
    const result = await get<FetchCommunicationPreferencesResult>(
      `${baseUrl}prefill/plugins/customer-interactions/communication-preferences/${submissionId}/component/${componentKey}`
    );
    return result!;
  } catch (error) {
    logError(error);
    return null;
  }
};
