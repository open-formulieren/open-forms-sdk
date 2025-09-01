import {FormattedMessage} from 'react-intl';

export interface SummaryProgressProps {
  current: number;
  total: number;
}

/**
 * A single summary progress indicator.
 *
 * It shows the short progress summary, indicating the current step number and total amount of steps.
 */
const SummaryProgress: React.FC<SummaryProgressProps> = ({current, total}) => (
  <div className="openforms-summary-progress">
    <FormattedMessage
      description="Summary progress label"
      defaultMessage="Step {current} of {total}"
      values={{
        current: current,
        total: total,
      }}
    />
  </div>
);

export default SummaryProgress;
