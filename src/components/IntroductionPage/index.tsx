import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {Navigate} from 'react-router';

import {FormContext} from '@/Context';
import Body from '@/components/Body';
import Card from '@/components/Card';
import FAIcon from '@/components/FAIcon';
import Link from '@/components/Link';
import {AUTH_VISIBLE_QUERY_PARAM} from '@/components/constants';
import useInitialDataReference from '@/hooks/useInitialDataReference';
import useQueryParam from '@/hooks/useQueryParam';

const IntroductionPage: React.FC = () => {
  const {name, introductionPageContent = ''} = useContext(FormContext);
  const {addInitialDataReference} = useInitialDataReference();
  const {addToUrl: addAuthVisible} = useQueryParam(AUTH_VISIBLE_QUERY_PARAM);

  const startPageUrl = addAuthVisible(addInitialDataReference('startpagina'));
  if (!introductionPageContent) {
    return <Navigate replace to={startPageUrl} />;
  }

  return (
    <Card title={name}>
      <Body
        modifiers={['wysiwyg']}
        component="div"
        dangerouslySetInnerHTML={{__html: introductionPageContent}}
      />

      <Link
        to={startPageUrl}
        as="button-link"
        appearance="primary-action-button"
        className="openforms-start-link"
      >
        <FormattedMessage
          description="Button text for link to continue from introduction page to start page"
          defaultMessage="Continue"
        />
        <FAIcon icon="arrow-right-long" />
      </Link>
    </Card>
  );
};

export default IntroductionPage;
