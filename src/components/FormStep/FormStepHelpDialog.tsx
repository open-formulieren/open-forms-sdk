import {Modal} from '@open-formulieren/formio-renderer';
import {useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {FormHelpButton} from '@/components/FormHelpButton';
import {FormHelpContent} from '@/components/FormHelpContent';
import Image from '@/components/Image';

export interface FormStepHelpDialogProps {
  content: string;
  image: string;
}

/**
 * Button and dialog/model for the form step help function.
 */
const FormStepHelpDialog: React.FC<FormStepHelpDialogProps> = ({content, image}) => {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  if (!content) throw new Error('You must pass non-empty content when rendering this component');

  return (
    <>
      <FormHelpButton onClick={() => setHelpDialogOpen(true)} />
      <Modal
        variant="sheet"
        title={
          <FormattedMessage
            description="Help dialog title text"
            defaultMessage="Do you need help?"
          />
        }
        isOpen={helpDialogOpen}
        closeModal={() => setHelpDialogOpen(false)}
      >
        <div className="openforms-step-help-dialog">
          <FormHelpContent content={content} />
          {image && (
            <Image src={image} className="openforms-step-help-dialog__image" aria-hidden="true" />
          )}
        </div>
      </Modal>
    </>
  );
};

export default FormStepHelpDialog;
