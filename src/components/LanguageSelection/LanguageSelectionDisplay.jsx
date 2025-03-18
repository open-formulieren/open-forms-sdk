import {ButtonGroup} from '@utrecht/button-group-react';
import {Heading, LinkButton} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import {Fragment} from 'react';

const Spacer = () => <span aria-hidden="true">{'|'}</span>;

const LanguageSelectionDisplay = ({heading, headingLevel, headingId, items, onLanguageChange}) => (
  <section className="utrecht-alternate-lang-nav" aria-labelledby={headingId}>
    <Heading level={headingLevel} className="utrecht-alternate-lang-nav__heading" id={headingId}>
      {heading}
    </Heading>
    <ButtonGroup>
      {items.map(({current, label, lang, textContent}, i, a) => (
        <Fragment key={lang}>
          <LinkButton
            pressed={current}
            lang={lang}
            aria-label={label}
            onClick={() => onLanguageChange(lang)}
            inline
          >
            {textContent}
          </LinkButton>
          {i + 1 < a.length ? <Spacer /> : null}
        </Fragment>
      ))}
    </ButtonGroup>
  </section>
);

LanguageSelectionDisplay.propTypes = {
  heading: PropTypes.node.isRequired,
  headingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
  headingId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      lang: PropTypes.string.isRequired,
      textContent: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      current: PropTypes.bool.isRequired,
    })
  ),
  onLanguageChange: PropTypes.func.isRequired,
};

export default LanguageSelectionDisplay;
