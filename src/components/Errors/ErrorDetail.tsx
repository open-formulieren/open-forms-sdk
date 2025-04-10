import Body from '@/components/Body';

import type {AnyError} from './types';

export interface ErrorDetailProps {
  error: AnyError;
}

/**
 * If the error prop is an object and contains a `detail` property, display it with
 * body styling, otherwise render nothing.`
 */
const ErrorDetail: React.FC<ErrorDetailProps> = ({error}) => {
  if (typeof error !== 'object') return null;
  if (!('detail' in error)) return null;
  return <Body>{error.detail}</Body>;
};

export default ErrorDetail;
