import styles from './container.module.scss';
import { HTMLProps, forwardRef } from 'react';

const Container = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
	const { children, className, ...rest } = props;
	return (
		<div ref={ref} {...rest} className={(className ? `${className} ` : '') + styles.container}>
			{children}
		</div>
	);
});

export default Container;
