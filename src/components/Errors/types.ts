import {APIError} from '@/errors';

// you can pretty much throw anything in JS
export type AnyError = Error | APIError | string | object;
