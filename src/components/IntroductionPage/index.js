import {ButtonLink} from '@utrecht/component-library-react';
import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {Navigate} from 'react-router-dom';

import {FormContext} from 'Context';
import Body from 'components/Body';
import Card from 'components/Card';
import FAIcon from 'components/FAIcon';
import Link from 'components/Link';

const IntroductionPage = ({extraParams = {}}) => {
  const {name, introductionPageContent = ''} = useContext(FormContext);
  if (!introductionPageContent) {
    return <Navigate replace to="startpagina" />;
  }
  let startUrl = '/startpagina';
  if (extraParams) startUrl = `${startUrl}?${new URLSearchParams(extraParams).toString()}`;
  return (
    <Card title={name}>
      <Body
        modifiers={['wysiwyg']}
        component="div"
        dangerouslySetInnerHTML={{__html: introductionPageContent}}
      />

      <Link
        to={startUrl}
        component={ButtonLink}
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
