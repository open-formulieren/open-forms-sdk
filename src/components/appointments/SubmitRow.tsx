import FormNavigation, {StepSubmitButton} from '@/components/FormNavigation';
import {LiteralsProvider} from '@/components/Literal';

export interface SubmitRowProps {
  canSubmit: boolean;
  nextText: string;
  previousText?: string;
  navigateBackTo?: string;
}

const SubmitRow: React.FC<SubmitRowProps> = ({
  canSubmit,
  nextText,
  previousText = '',
  navigateBackTo = '',
}) => (
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
    />
  </LiteralsProvider>
);

export default SubmitRow;
