'use client';
import { TrashIcon } from '@phosphor-icons/react/ssr';
import styles from './delete-form.module.css';
import { useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';

type DeleteFormProps = {
	validationText: string;
	onValidation: () => void;
};

const DeleteForm = ({ validationText, onValidation }: DeleteFormProps) => {
	const handleClick = async () => {
		const response: boolean = window.confirm(validationText);
		if (response) {
			onValidation();
		}
	};

	return (
		<>
			<button onClick={handleClick} className={styles.deleteButton}>
				<TrashIcon size={24} />
			</button>
		</>
	);
};

export default DeleteForm;
