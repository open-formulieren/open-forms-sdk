import {useContext} from 'react';
import {Navigate} from 'react-router';

import {FormContext} from '@/Context';
import FormContainer from '@/components/FormContainer';
import NextLink from '@/components/NextLink';
import RichText from '@/components/RichText';
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
      <RichText content={introductionPageContent} />
      <NextLink url={nextPageUrl} />
    </FormContainer>
  );
};

export default IntroductionPage;
