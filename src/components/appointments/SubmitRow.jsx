import PropTypes from 'prop-types';
import {useNavigate} from 'react-router';

import FormNavigation, {StepSubmitButton} from 'components/FormNavigation/index';
import {LiteralsProvider} from 'components/Literal';

const SubmitRow = ({canSubmit, nextText, previousText = '', navigateBackTo = ''}) => {
  const navigate = useNavigate();

  return (
    <LiteralsProvider
      literals={{
        nextText: {resolved: nextText},
        previousText: {resolved: previousText},
      }}
    >
      <FormNavigation
        submitButton={
          <StepSubmitButton
            canSubmitStep={canSubmit}
            isCheckingLogic={false}
            canSubmitForm="yes"
            isLastStep={false}
          />
        }
        hideAbortButton
        isAuthenticated={false} // TODO -> if authenticated (for prefill), logout must be shown
        onDestroySession={async () => {}}
        previousPage={navigateBackTo ? `../${navigateBackTo}` : ''}
        onNavigatePrevPage={navigateBackTo ? () => navigate(`../${navigateBackTo}`) : undefined}
      />
    </LiteralsProvider>
  );
};

SubmitRow.propTypes = {
  canSubmit: PropTypes.bool.isRequired,
  nextText: PropTypes.string.isRequired,
  previousText: PropTypes.string,
  navigateBackTo: PropTypes.string,
};

export default SubmitRow;
