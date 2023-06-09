import { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import styles from './modal.module.css';

const modalRoot = document.querySelector("#modal-root");

class Modal extends Component {

    componentDidMount() {
        document.addEventListener('keydown', this.closeModal)
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.closeModal)
    }

    closeModal = ({ target, currentTarget, code }) => {
        if (target === currentTarget || code === "Escape") {
            this.props.close()
        }
    }
    render() {
        const { children, close } = this.props;
        const { closeModal } = this;
        return (
            createPortal(
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.modal}>
                        <span className={styles.close} onClick={close}>X</span>
                        {children}
                    </div>
                </div>,
                modalRoot
            )

        )
    }
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  close: PropTypes.func.isRequired,
};

export default Modal;