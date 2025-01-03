import PropTypes from 'prop-types';
import {createContext, useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import ReactModal from 'react-modal';

import {OFButton} from 'components/Button';
import FAIcon from 'components/FAIcon';
import {getBEMClassName} from 'utils';

export const ModalContext = createContext({});
ModalContext.displayName = 'ModalContext';

const usePreventScroll = open => {
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

const Modal = ({
  isOpen = false,
  title = '',
  titleComponent: Title = 'h1',
  closeModal,
  contentModifiers = [],
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
      className={getBEMClassName('react-modal__content', contentModifiers)}
      overlayClassName={getBEMClassName('react-modal__overlay')}
      parentSelector={parentSelector}
      ariaHideApp={ariaHideApp}
      {...props}
    >
      <header className={getBEMClassName('react-modal__header')}>
        {title ? <Title className={getBEMClassName('react-modal__title')}>{title}</Title> : null}
        <OFButton
          appearance="subtle-button"
          onClick={closeModal}
          className={getBEMClassName('react-modal__close')}
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

Modal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.node,
  titleComponent: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.node,
  contentModifiers: PropTypes.arrayOf(PropTypes.string),
};

export default Modal;
