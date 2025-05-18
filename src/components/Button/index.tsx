import React, { ButtonHTMLAttributes, forwardRef } from 'react'; // Import forwardRef
import styles from './button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const { children, icon, className, type, ...rest } = props;

	return (
		<button ref={ref} type={type || 'button'} className={`${styles.button} ${className || ''}`.trim()} {...rest}>
			{children}
			{icon && <span className={styles.icon}>{icon}</span>}
		</button>
	);
});

export default Button;
