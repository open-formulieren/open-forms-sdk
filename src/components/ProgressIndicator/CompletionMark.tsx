import {useIntl} from 'react-intl';

import FAIcon from '@/components/FAIcon';

export interface CompletionMarkProps {
  completed?: boolean;
}

const CompletionMark: React.FC<CompletionMarkProps> = ({completed = false}) => {
  const intl = useIntl();
  // The wrapper is a DOM element, which can't handle <FormattedMessage />
  const ariaLabel = intl.formatMessage({
    description: 'Step completion marker icon label',
    defaultMessage: 'Completed',
  });

  if (!completed) return null;

  // provide a text alternative with aria-hidden="true" attribute on the icon and include text with an
  // additional element, such as a <span>, with appropriate CSS to visually hide the element while keeping it
  // accessible to assistive technologies. Only here where the Completion mark icon actually has a meaning.
  return (
    <>
      <FAIcon icon="check" small aria-label={ariaLabel} title={ariaLabel} />
      <span className="sr-only">{ariaLabel}</span>
    </>
  );
};

export default CompletionMark;
