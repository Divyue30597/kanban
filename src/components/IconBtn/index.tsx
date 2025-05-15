import styles from './iconBtn.module.scss';

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

function IconBtn({ children, className, ...rest }: IconBtnProps) {
	return (
		<button
			type="button"
			className={`${className} ${styles.iconBtn}`}
			{...rest}
		>
			{children}
		</button>
	);
}

export default IconBtn;
