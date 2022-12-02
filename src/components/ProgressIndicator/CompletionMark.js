import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';

import FAIcon from 'components/FAIcon';

const CompletionMark = ({completed = false}) => {
  const intl = useIntl();
  // Wrapper may be a DOM element, which can't handle <FormattedMessage />
  const ariaLabel = intl.formatMessage({
    description: 'Completion message',
    defaultMessage: 'Completed',
  });

  if (!completed) return null;

  // provide a text alternative with aria-hidden="true" attribute on the icon and include text with an
  // additional element, such as a <span>, with appropriate CSS to visually hide the element while keeping it
  // accessible to assistive technologies. Only here where the Completion mark icon actually has a meaning.
  return (
    <>
      <FAIcon
        icon="check"
        modifiers={['small']}
        aria-hidden="true"
        aria-label={ariaLabel}
        title={ariaLabel}
      />
      <span class="sr-only">{ariaLabel}</span>
    </>
  );
};

CompletionMark.propTypes = {
  completed: PropTypes.bool,
};

export default CompletionMark;
