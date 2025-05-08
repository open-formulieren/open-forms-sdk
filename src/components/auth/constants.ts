/**
 * DigiD, eHerkenning and eIDAS all use these error codes.
 */
export type AuthErrorCode = 'login-cancelled' | 'error';

export type MessageParamName = '_digid-message' | '_eherkenning-message' | '_eidas-message';

// Uses a list of tuples instead of a mapping for type safety in the consuming code,
// as otherwise the union information is lost through Object.keys|entries
export const MAPPING_PARAMS_SERVICE: [MessageParamName, string][] = [
  ['_digid-message', 'DigiD'],
  ['_eherkenning-message', 'EHerkenning'],
  ['_eidas-message', 'eIDAS'],
];
