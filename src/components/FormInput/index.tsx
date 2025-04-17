import { useState } from 'react';
import styles from './input.module.scss';

type InputElementType = HTMLInputElement | HTMLTextAreaElement;

// Extend FormInputProps with React's HTML attributes
type FormInputProps = {
	label: string;
	type: string;
	id: string;
	name: string;
	placeholder?: string;
	value: string | string[] | File[];
	errorMessage: string;
	required?: boolean;
	pattern?: string;
	autoComplete?: string;
	onChange?: (event: React.ChangeEvent<InputElementType>) => void;
	onBlur?: (event: React.FocusEvent<InputElementType>) => void;
	rows?: number;
	cols?: number;
	infoMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
	React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function FormInput(props: FormInputProps) {
	const {
		label,
		placeholder,
		type,
		id,
		name,
		value,
		pattern,
		required,
		autoComplete = 'off',
		onChange,
		onBlur,
		errorMessage,
		infoMessage,
		rows = 4,
		cols = 50,
		...rest
	} = props;

	const [focus, setFocus] = useState(false);

	const handleBlur = (e: React.FocusEvent<InputElementType>) => {
		setFocus(true);
		if (onBlur) {
			onBlur(e);
		}
	};

	const commonProps = {
		className: focus ? 'focused' : '',
		id,
		name,
		required,
		placeholder,
		autoComplete,
		onChange,
		onBlur: handleBlur,
		value,
		...rest,
	};

	const renderInput = () => {
		if (type === 'textarea') {
			return <textarea rows={rows} cols={cols} {...commonProps} />;
		} else if (type === 'file') {
			const { value, ...rest } = commonProps;
			return <input {...rest} type="file" />;
		} else {
			return <input type={type} pattern={pattern} {...commonProps} />;
		}
	};

	return (
		<div className={styles.input}>
			<label htmlFor={id}>{label}</label>
			{renderInput()}
			{infoMessage?.length && (
				<span className={styles.infoMessage}>{infoMessage}</span>
			)}
			{errorMessage && (
				<span className={styles.error}>{errorMessage}</span>
			)}
		</div>
	);
}

export default FormInput;
export type { FormInputProps };
