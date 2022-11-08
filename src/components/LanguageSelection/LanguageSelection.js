import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useAsync } from "react-use";

import { get, put } from "api";
import { v4 as uuidv4 } from "uuid";
import { ConfigContext } from "Context";
import Loader from "components/Loader";

import LanguageSelectionDisplay from "./LanguageSelectionDisplay";

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
  const { onLanguageChange, ...displayProps } = props;
  const headingId = uuidv4(); // TODO: useId() from 'react' in react > 18;

  const changeLanguage = async (lang_code) => {
    if (lang_code === current) return;
    const prev = current;
    // use current as a semaphore to prevent leaking memory
    setCurrent(lang_code);
    try {
      await put(`${config.baseUrl}i18n/language`, { code: lang_code });
    } catch(e) {
      setCurrent(prev); // language didn't actually change
      throw(e);
    }
    onLanguageChange(lang_code);
  };

  return (
    <LanguageSelectionDisplay
      onLanguageChange={changeLanguage}
      headingId={headingId}
      items={items}
      {...displayProps}
    />
  );
};

LanguageSelection.propTypes = {
  heading: PropTypes.node,
  headingLevel: PropTypes.number,
  onLanguageChange: PropTypes.func,
};

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
