import {get} from '@/api';
import {logError} from '@/components/Errors';

/**
 * @see `#/components/schemas/GetStreetNameAndCityViewResult` in the API spec.
 */
export interface AutoCompleteResult {
  streetName: string;
  city: string;
  secretStreetCity: string;
}

export const autoCompleteAddress = async (
  baseUrl: string,
  postcode: string,
  houseNumber: string
): Promise<AutoCompleteResult | null> => {
  const params: Record<string, string> = {
    postcode: postcode,
    house_number: houseNumber,
  };
  try {
    const result = await get<AutoCompleteResult>(`${baseUrl}geo/address-autocomplete`, params);
    return result!;
  } catch (error) {
    logError(error);
    return null;
  }
};
