import {LoadingIndicator, PrimaryActionButton} from '@open-formulieren/formio-renderer';
import type {PartnerDetails} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

const PartnerSubmitButton: React.FC = () => {
  const {isSubmitting} = useFormikContext<PartnerDetails>();
  return (
    <PrimaryActionButton type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <LoadingIndicator position="center" size="small" color="muted" />
      ) : (
        <FormattedMessage
          description="Add partner: save partner data button text"
          defaultMessage="Save"
        />
      )}
    </PrimaryActionButton>
  );
};

export default PartnerSubmitButton;
