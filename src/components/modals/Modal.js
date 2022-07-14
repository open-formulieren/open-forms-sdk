import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import {useIntl} from 'react-intl';

import FAIcon from 'components/FAIcon';
import {getBEMClassName} from 'utils';

const usePreventScroll = (open) => {
  useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      }
    }, [open]);
};

const Modal = ({
  isOpen=false,
  title='',
  titleComponent: Title = 'h2',
  closeModal,
  contentModifiers=[],
  children,
}) => {
    usePreventScroll(isOpen);
    const intl = useIntl();
    return (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          className={getBEMClassName('react-modal__content', contentModifiers)}
          overlayClassName={getBEMClassName("react-modal__overlay")}
        >
            <header className={getBEMClassName("react-modal__header")}>
                { title ? <Title className={getBEMClassName("react-modal__title")}>{title}</Title> : null }
              <FAIcon
                icon="close"
                extraClassName={getBEMClassName("react-modal__close")}
                title={intl.formatMessage({
                  description: 'Modal close icon title',
                  defaultMessage: 'Close',
                })}
                onClick={closeModal}
              />
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
