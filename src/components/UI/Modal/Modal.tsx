import { ReactNode } from 'react';
import styles from './modal.module.css';

type ModalProps = {
	children: ReactNode;
};

const Modal = ({ children }: ModalProps) => {
	return (
		<div className={styles.modalPage}>
			<div className={styles.modal}>{children}</div>
		</div>
	);
};

export default Modal;
