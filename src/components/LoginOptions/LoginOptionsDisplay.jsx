import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import LoginButton from 'components/LoginButton';
import FormattedLoginOption from 'types/FormattedLoginOption';
import {getBEMClassName} from 'utils';

const LoginOptionsDisplay = ({
  loginAsYourselfOptions,
  loginAsGemachtigdeOptions,
  cosignLoginOptions,
  isolateCosignOptions = true,
}) => {
  return (
    <div className={getBEMClassName('login-options')}>
      <div className={getBEMClassName('login-options__list')}>
        {loginAsYourselfOptions.map(option => (
          <LoginButton key={option.identifier} option={option} />
        ))}
      </div>

      {loginAsGemachtigdeOptions.length > 0 && (
        <>
          <h2 className={getBEMClassName('login-options__caption')}>
            <FormattedMessage
              description="Log in on behalf of someone else title"
              defaultMessage="Log in on behalf of someone else"
            />
          </h2>

          <div className={getBEMClassName('login-options__list')}>
            {loginAsGemachtigdeOptions.map(option => (
              <LoginButton key={option.identifier} option={option} />
            ))}
          </div>
        </>
      )}

      {cosignLoginOptions?.length > 0 && (
        <div
          className={isolateCosignOptions ? getBEMClassName('login-options__cosign') : undefined}
        >
          {isolateCosignOptions && (
            <>
              <h2 className={getBEMClassName('login-options__caption')}>
                <FormattedMessage
                  description="Log in to co-sign the form title"
                  defaultMessage="Log in to co-sign the form"
                />
              </h2>
              <Body>
                <FormattedMessage
                  description="Cosign start explanation message"
                  defaultMessage={`Did you receive an email with a request to cosign?
                Start the cosigning by logging in.`}
                />
              </Body>
            </>
          )}

          <div className={getBEMClassName('login-options__list')}>
            {cosignLoginOptions.map(option => (
              <LoginButton key={option.identifier} option={option} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

LoginOptionsDisplay.propTypes = {
  loginAsYourselfOptions: PropTypes.arrayOf(FormattedLoginOption).isRequired,
  loginAsGemachtigdeOptions: PropTypes.arrayOf(FormattedLoginOption).isRequired,
  cosignLoginOptions: PropTypes.arrayOf(FormattedLoginOption),
  isolateCosignOptions: PropTypes.bool,
};

export default LoginOptionsDisplay;
