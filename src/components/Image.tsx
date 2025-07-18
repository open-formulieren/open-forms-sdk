import {Image as UtrechtImage} from '@utrecht/component-library-react';

export interface ImageProps {
  src: string;
  alt?: string;
}

const Image: React.FC<ImageProps> = ({src, alt = ''}) => {
  return <UtrechtImage className="openforms-image" src={src} alt={alt} />;
};

export default Image;
