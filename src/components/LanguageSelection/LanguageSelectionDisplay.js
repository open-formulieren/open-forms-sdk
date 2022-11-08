import PropTypes from "prop-types";
import { Fragment } from "react";

import { ButtonGroup, Heading } from "@utrecht/component-library-react";

import Button from "components/Button";

const LanguageSelectionDisplay = ({
  heading,
  headingLevel,
  headingId,
  items,
  onLanguageChange,
}) => (
  <section className="utrecht-alternate-lang-nav" aria-labelledby={headingId}>
    <Heading
      level={headingLevel}
      className="utrecht-alternate-lang-nav__heading"
      id={headingId}
    >
      {heading}
    </Heading>
    <ButtonGroup>
      {items.map(({ current, label, lang, textContent }, i, a) => (
        <Fragment key={lang}>
          <Button
            variant="anchor"
            component="button"
            pressed={current}
            lang={lang}
            aria-label={label}
            onClick={() => onLanguageChange(lang)}
            inline
          >
            {textContent}
          </Button>
          {i + 1 < a.length ? <span aria-hidden="true">{" | "}</span> : <></>}
        </Fragment>
      ))}
    </ButtonGroup>
  </section>
);

LanguageSelectionDisplay.propTypes = {
  heading: PropTypes.node.isRequired,
  headingLevel: PropTypes.number.isRequired,
  headingId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
      lang: PropTypes.string.isRequired,
      textContent: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      current: PropTypes.bool.isRequired,
  })),
  onLanguageChange: PropTypes.func.isRequired,
};

export default LanguageSelectionDisplay;
