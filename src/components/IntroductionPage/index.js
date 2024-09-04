import {ButtonLink} from '@utrecht/component-library-react';
import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {Navigate} from 'react-router-dom';

import {FormContext} from 'Context';
import Body from 'components/Body';
import Card from 'components/Card';
import Link from 'components/Link';

const IntroductionPage = () => {
  const {name, introductionPageContent = ''} = useContext(FormContext);
  if (!introductionPageContent) {
    return <Navigate replace to="startpagina" />;
  }
  return (
    <Card title={name}>
      <Body
        modifiers={['wysiwyg']}
        component="div"
        dangerouslySetInnerHTML={{__html: introductionPageContent}}
      />

      <Link to="/startpagina" component={ButtonLink} appearance="primary-action-button">
        <FormattedMessage
          description="Button text for link to continue from introduction page to start page"
          defaultMessage="Continue ➜"
        />
      </Link>
    </Card>
  );
};

IntroductionPage.propTypes = {};

export default IntroductionPage;
