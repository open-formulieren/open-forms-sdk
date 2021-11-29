import React from 'react';
import {useIntl} from 'react-intl';

import Types from 'types';
import LoginButtonIcons from 'components/LoginButtonIcons';
import {LiteralsProvider} from 'components/Literal';
import Card from 'components/Card';
import Body from 'components/Body';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import LoginButton from 'components/LoginButton';


export const getLoginUrl = (loginOption) => {
  const currentUrl = new URL(window.location.href);
  const nextUrl = currentUrl.searchParams.get('next');

  const loginUrl = new URL(loginOption.url);
  loginUrl.searchParams.set('next', nextUrl);
  return loginUrl.toString();
};


const ResumeLogin = ({form}) => {
  const intl = useIntl();

  const resumeLoginMessage = intl.formatMessage({
    description: 'Form resume login body text',
    defaultMessage: 'Please authenticate to resume the form.'
  });

  return (
    <LiteralsProvider literals={form.literals}>
      <Card title={form.name}>

        <Body modifiers={['compact']}>
          {resumeLoginMessage}
        </Body>

        <Toolbar modifiers={['start']}>
          <ToolbarList>
            {
              form.loginOptions.map((option) => (
                <LoginButton
                  key={option.identifier}
                  option={option}
                  getLoginUrl={getLoginUrl}
                />
              ))
            }
          </ToolbarList>

          <ToolbarList>
            <LoginButtonIcons loginOptions={form.loginOptions} />
          </ToolbarList>
        </Toolbar>

      </Card>
    </LiteralsProvider>
  );
};


ResumeLogin.propTypes = {
  form: Types.Form.isRequired,
}


export default ResumeLogin;
