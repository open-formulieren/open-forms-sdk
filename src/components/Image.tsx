import {Image as UtrechtImage} from '@utrecht/component-library-react';
import {clsx} from 'clsx';

export interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({src, alt = '', className}) => {
  return <UtrechtImage className={clsx('openforms-image', className)} src={src} alt={alt} />;
};

export default Image;
