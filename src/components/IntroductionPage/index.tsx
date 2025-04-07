import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {Navigate} from 'react-router';

import {FormContext} from 'Context';
import Body from 'components/Body';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';
import Link from 'components/Link';
import useInitialDataReference from 'hooks/useInitialDataReference';

const IntroductionPage: React.FC = () => {
  const {name, introductionPageContent = ''} = useContext(FormContext);
  const {addInitialDataReference} = useInitialDataReference();

  const startPageUrl = addInitialDataReference('startpagina');
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

IntroductionPage.propTypes = {};

export default IntroductionPage;
