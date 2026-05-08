import { InputHTMLAttributes, JSX } from 'react';
import styles from './input.module.css';

export type InputProps = {
	label: string;
	icon?: JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
	type,
	name,
	label,
	placeholder,
	required = true,
	defaultValue,
	icon,
}: InputProps) => {
	const isHidden: boolean = type === 'hidden';

	return (
		<div className={styles.inputDiv}>
			{!isHidden && (
				<div className={styles.inputLabel}>
					{icon && icon}
					<label htmlFor={name}>
						{label}
						{required && '*'}
					</label>
				</div>
			)}
			<input
				type={type}
				name={name}
				id={name}
				placeholder={placeholder}
				required={required}
				defaultValue={defaultValue}
			/>
		</div>
	);
};

export default Input;
