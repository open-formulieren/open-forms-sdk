import React, {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {useSearchParams} from 'react-router';

import {ConfigContext} from '@/Context';
import {Literal} from '@/components/Literal';
import {getCosignLoginUrl, getLoginUrl} from '@/components/LoginOptions/utils';
import type {Form} from '@/data/forms';

import LoginOptionsDisplay, {type FormattedLoginOption} from './LoginOptionsDisplay';

export interface OnFormStartOptions {
  isAnonymous?: boolean;
}

export interface LoginOptionsProps {
  form: Form;
  onFormStart: (opts: OnFormStartOptions) => Promise<void> | void;
  extraNextParams?: Record<string, string>;
  isolateCosignOptions?: boolean;
}

const LoginOptions: React.FC<LoginOptionsProps> = ({
  form,
  onFormStart,
  extraNextParams = {},
  isolateCosignOptions = true,
}) => {
  const [params] = useSearchParams();

  const loginAsYourselfOptions: FormattedLoginOption[] = [];
  const loginAsGemachtigdeOptions: FormattedLoginOption[] = [];
  const cosignLoginOptions: FormattedLoginOption[] = [];
  const {authVisible} = useContext(ConfigContext);

  form.loginOptions.forEach(option => {
    const formattedOption: FormattedLoginOption = {
      ...option,
      url: getLoginUrl(option, {}, extraNextParams),
      label: (
        <FormattedMessage
          description="Login button label"
          defaultMessage="Login with {provider}"
          values={{provider: option.label}}
        />
      ),
    };

    // show only visible login options by default
    // or show all login options if the query param ?authVisible=all is provided
    if (option.visible || authVisible === 'all') {
      if (formattedOption.isForGemachtigde) {
        loginAsGemachtigdeOptions.push(formattedOption);
      } else {
        loginAsYourselfOptions.push(formattedOption);
      }
    }
  });

  if (form.cosignLoginOptions) {
    const cosignCode = params.get('code');
    form.cosignLoginOptions.forEach(option => {
      const loginUrl = getCosignLoginUrl(option, cosignCode ? {code: cosignCode} : undefined);
      cosignLoginOptions.push({
        ...option,
        url: loginUrl,
        label: (
          <FormattedMessage
            description="Login button label"
            defaultMessage="Login with {provider}"
            values={{provider: option.label}}
          />
        ),
      });
    });
  }

  if (!form.loginRequired) {
    loginAsYourselfOptions.push({
      identifier: 'anonymous',
      label: <Literal name="beginText" />,
    });
  }

  const Container = form.loginRequired ? React.Fragment : 'form';
  const containerProps = form.loginRequired
    ? {}
    : {
        onSubmit: async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          await onFormStart({isAnonymous: true});
        },
        'data-testid': 'start-form',
      };

  return (
    <Container {...containerProps}>
      <LoginOptionsDisplay
        loginAsYourselfOptions={loginAsYourselfOptions}
        loginAsGemachtigdeOptions={loginAsGemachtigdeOptions}
        cosignLoginOptions={cosignLoginOptions}
        isolateCosignOptions={isolateCosignOptions}
      />
    </Container>
  );
};

export default LoginOptions;
