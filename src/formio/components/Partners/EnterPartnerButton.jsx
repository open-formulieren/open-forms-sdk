import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import {OFButton} from 'components/Button';
import Loader from 'components/Loader';

const EnterPartnerButton = () => {
  const {isSubmitting} = useFormikContext();
  return (
    <OFButton type="submit" appearance="primary-action-button" disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
      ) : (
        <FormattedMessage
          description="Add partner: save partner data button text"
          defaultMessage="Save"
        />
      )}
    </OFButton>
  );
};

export default EnterPartnerButton;
