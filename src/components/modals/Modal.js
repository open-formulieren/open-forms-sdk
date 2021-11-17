import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import FAIcon from 'components/FAIcon';
import {FormattedMessage} from "react-intl";
import {getBEMClassName} from "../../utils";

const Modal = ({ isOpen=false, title='', closeModal, children, contentModifiers=[] }) => {
    return (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          className={getBEMClassName('react-modal__content', contentModifiers)}
          overlayClassName={getBEMClassName("react-modal__overlay")}
        >
            <header className={getBEMClassName("react-modal__header")}>
                { title ? <h2 className={getBEMClassName("react-modal__title")}>{title}</h2> : null }
              <FAIcon
                icon="close"
                extraClassName={getBEMClassName("react-modal__close")}
                title={<FormattedMessage
                  description="Modal close icon title"
                  defaultMessage="Close"
                />}
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
    closeModal: PropTypes.func.isRequired,
    children: PropTypes.node,
    contentModifiers: PropTypes.arrayOf(PropTypes.string),
};

export default Modal;
