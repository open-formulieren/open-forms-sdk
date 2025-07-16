import {createContext, useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import ReactModal from 'react-modal';

import {OFButton} from '@/components/Button';
import FAIcon from '@/components/FAIcon';
import {getBEMClassName} from '@/utils';

interface ModalContextType {
  ariaHideApp?: boolean;
  parentSelector?: () => HTMLElement;
}

export const ModalContext = createContext<ModalContextType>({});
ModalContext.displayName = 'ModalContext';

const usePreventScroll = (open: boolean): void => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);
};

export type ModalCloseHandler = React.EventHandler<React.MouseEvent | React.KeyboardEvent>;

interface ModalProps {
  isOpen?: boolean;
  title?: React.ReactNode;
  closeModal: ModalCloseHandler;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  title = '',
  closeModal,
  children,
  ...props
}) => {
  usePreventScroll(isOpen);
  const intl = useIntl();
  const {parentSelector, ariaHideApp} = useContext(ModalContext);
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={getBEMClassName('react-modal__content')}
      overlayClassName={getBEMClassName('react-modal__overlay')}
      parentSelector={parentSelector}
      ariaHideApp={ariaHideApp}
      {...props}
    >
      <header className={getBEMClassName('react-modal__header')}>
        {title ? <h1 className={getBEMClassName('react-modal__title')}>{title}</h1> : null}
        <OFButton
          appearance="subtle-button"
          onClick={closeModal}
          className={getBEMClassName('react-modal__close')}
          variant="default"
          title={intl.formatMessage({
            description: 'Modal close icon title',
            defaultMessage: 'Close',
          })}
          aria-label={intl.formatMessage({
            description: 'Modal close icon title',
            defaultMessage: 'Close',
          })}
        >
          <FAIcon icon="close" />
        </OFButton>
      </header>
      {children}
    </ReactModal>
  );
};

export default Modal;
