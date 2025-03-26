import {FormattedMessage} from 'react-intl';

import MaintenanceMode from '@/components/MaintenanceMode';
import {PermissionDenied, ServiceUnavailable, UnprocessableEntity} from '@/errors';

import FormDeactivatedError from './FormDeactivatedError';
import FormMaximumSubmissionsError from './FormMaximumSubmissionsError';
import FormUnavailableError from './FormUnavailableError';
import GenericError from './GenericError';
import PermissionDeniedError from './PermissionDeniedError';
import type {AnyError} from './types';

export interface ErrorDisplayProps {
  error: AnyError;
  useCard?: boolean;
}

/**
 * Given the error, look up the appropriate display component and render that, falling
 * back to a generic display if no specific variant is available.
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({error, useCard = false}) => {
  // 403
  if (error instanceof PermissionDenied) {
    return <PermissionDeniedError error={error} useCard={useCard} />;
  }

  // 422
  if (error instanceof UnprocessableEntity) {
    if (error.code === 'form-inactive') {
      return <FormDeactivatedError useCard={useCard} />;
    }
  }

  // 503
  if (error instanceof ServiceUnavailable) {
    switch (error.code) {
      case 'form-maintenance': {
        return (
          <MaintenanceMode
            title={
              <FormattedMessage
                description="'Maintenance mode form' error title"
                defaultMessage="Form temporarily unavailable"
              />
            }
          />
        );
      }
      case 'form-maximum-submissions': {
        return <FormMaximumSubmissionsError />;
      }
      case 'service_unavailable': {
        return <FormUnavailableError useCard={useCard} />;
      }
    }
  }

  // fall back to the generic case
  return <GenericError error={error} useCard={useCard} />;
};

export default ErrorDisplay;
