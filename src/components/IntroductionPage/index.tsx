import {useContext} from 'react';
import {Navigate} from 'react-router';

import {FormContext} from '@/Context';
import Body from '@/components/Body';
import FormContainer from '@/components/FormContainer';
import NextLink from '@/components/NextLink';
import useQueryParams from '@/hooks/useQueryParams';

const IntroductionPage: React.FC = () => {
  const {introductionPageContent = '', helpCalloutPage} = useContext(FormContext);
  const {preserveQueryParams} = useQueryParams();

  const nextPageUrl: string = preserveQueryParams(
    helpCalloutPage.content && helpCalloutPage.display === 'before_start_page'
      ? 'hulp'
      : 'startpagina'
  );

  if (!introductionPageContent) {
    return <Navigate replace to={nextPageUrl} />;
  }

  return (
    <FormContainer>
      <Body
        modifiers={['wysiwyg']}
        component="div"
        dangerouslySetInnerHTML={{__html: introductionPageContent}}
      />
      <NextLink url={nextPageUrl} />
    </FormContainer>
  );
};

export default IntroductionPage;
