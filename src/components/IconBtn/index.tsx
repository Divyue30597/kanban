import styles from './iconBtn.module.scss';

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

function IconBtn({ children, className, title, ...rest }: IconBtnProps) {
	return (
		<button type="button" title={title} className={`${className} ${styles.iconBtn}`} {...rest}>
			{children}
		</button>
	);
}

export default IconBtn;
