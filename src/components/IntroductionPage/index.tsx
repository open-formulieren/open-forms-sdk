import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {Navigate} from 'react-router';

import {FormContext} from '@/Context';
import Body from '@/components/Body';
import FAIcon from '@/components/FAIcon';
import FormContainer from '@/components/FormContainer';
import Link from '@/components/Link';
import useQueryParams from '@/hooks/useQueryParams';

const IntroductionPage: React.FC = () => {
  const {introductionPageContent = ''} = useContext(FormContext);
  const {preserveQueryParams} = useQueryParams();

  const startPageUrl = preserveQueryParams('startpagina');
  if (!introductionPageContent) {
    return <Navigate replace to={startPageUrl} />;
  }

  return (
    <FormContainer>
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
    </FormContainer>
  );
};

export default IntroductionPage;
