import {useContext, useEffect, useState} from 'react';

import {ConfigContext} from '@/Context';
import {get} from '@/api';
import RichText from '@/components/RichText';
import useFormContext from '@/hooks/useFormContext';

export interface FormProductDetailsProps {
  productName: string;
  productContent: string[];
}

/**
 * The form product's content.
 *
 * When a form defines a local product the name and the information are shown. For external
 * products we retrieve the name and the content from the API resource.
 */
const FormProductDetails: React.FC = () => {
  const {baseUrl} = useContext(ConfigContext);
  const form = useFormContext();

  const [productDetails, setProductDetails] = useState<FormProductDetailsProps | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const result = await get<FormProductDetailsProps>(
        `${baseUrl}forms/${form.uuid}/forms-product-details`
      );

      setProductDetails(result);
    };

    fetchProductDetails();
  }, [baseUrl, form.uuid]);

  return (
    <>
      {productDetails?.productName}
      {productDetails?.productContent.map((content, index) => (
        <RichText key={index} content={content} />
      ))}
    </>
  );
};

export default FormProductDetails;
