import type {ChildDetails} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import {OFButton} from '@/components/Button';
import Loader from '@/components/Loader';

const ChildrenSubmitButton: React.FC = () => {
  const {isSubmitting} = useFormikContext<ChildDetails>();
  return (
    <OFButton
      type="submit"
      appearance="primary-action-button"
      disabled={isSubmitting}
      variant="default"
    >
      {isSubmitting ? (
        <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
      ) : (
        <FormattedMessage
          description="Add child: save child data button text"
          defaultMessage="Save"
        />
      )}
    </OFButton>
  );
};

export default ChildrenSubmitButton;
