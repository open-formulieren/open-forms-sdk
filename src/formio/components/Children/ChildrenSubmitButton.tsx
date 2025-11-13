import {PrimaryActionButton} from '@open-formulieren/formio-renderer';
import type {ChildDetails} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import Loader from '@/components/Loader';

const ChildrenSubmitButton: React.FC = () => {
  const {isSubmitting} = useFormikContext<ChildDetails>();
  return (
    <PrimaryActionButton type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
      ) : (
        <FormattedMessage
          description="Add child: save child data button text"
          defaultMessage="Save"
        />
      )}
    </PrimaryActionButton>
  );
};

export default ChildrenSubmitButton;
