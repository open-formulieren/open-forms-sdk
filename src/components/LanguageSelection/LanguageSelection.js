import React, { useContext, useState } from "react";
import { ConfigContext } from "Context";
import { useAsync } from "react-use";
import Loader from "components/Loader";
import { FormattedMessage, useIntl } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import {
  ButtonGroup,
  Heading,
  LinkButton,
} from "@utrecht/component-library-react";
import { get, put } from "../../api";
import PropTypes from "prop-types";

const propTypes = PropTypes.shape({
  heading: PropTypes.string,
  headingLevel: PropTypes.number,
  onLanguageChange: PropTypes.func,
});

const LanguageSelection = (props) => {
  // Hook uses
  const config = useContext(ConfigContext);
  const { locale } = useIntl();
  const [current, setCurrent] = useState(locale);
  const getAvailableLanguages = async () => {
    const result = await get(`${config.baseUrl}i18n/info`);
    setCurrent(result.current); // state change if current changed
    return result.languages.map(({ code, name }) => ({
      lang: code,
      textContent: code.toUpperCase(),
      label: name,
      current: code === result.current,
    }));
  };
  const {
    loading,
    value: items,
    error,
  } = useAsync(
    getAvailableLanguages,
    [config.baseUrl] // actually current too?!
  );
  if (error) {
    throw error; // bubble up to boundary
  }
  if (loading) {
    return <Loader modifiers={["small"]} />;
  }

  // unpack props
  const { heading, headingLevel, onLanguageChange } = props;
  const headingId = uuidv4(); // XXX: useId() from 'react'

  const changeLanguage = (lang_code) => async () => {
    if (lang_code === current) return;
    await put(`${config.baseUrl}i18n/language`, { code: lang_code });
    setCurrent(lang_code); // state change
    onLanguageChange(lang_code);
  };

  return (
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
          <>
            <LinkButton
              pressed={current}
              lang={lang}
              aria-label={label}
              key={lang}
              onClick={changeLanguage(lang)}
              inline
            >
              {textContent}
            </LinkButton>
            {i + 1 < a.length ? <span aria-hidden="true">{" | "}</span> : <></>}
          </>
        ))}
      </ButtonGroup>
    </section>
  );
};

LanguageSelection.propTypes = propTypes;
LanguageSelection.defaultProps = {
  heading: (
    <FormattedMessage
      description="Language selection heading"
      defaultMessage="Choose language"
    />
  ),
  headingLevel: 2,
  onLanguageChange: (new_language_code) => {},
};

export default LanguageSelection;
