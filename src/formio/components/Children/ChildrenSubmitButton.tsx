import {LoadingIndicator, PrimaryActionButton} from '@open-formulieren/formio-renderer';
import type {ChildDetails} from '@open-formulieren/types/dist/components/children';
import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

const ChildrenSubmitButton: React.FC = () => {
  const {isSubmitting} = useFormikContext<ChildDetails>();
  return (
    <PrimaryActionButton type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <LoadingIndicator position="center" size="small" color="muted" />
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
