import { HTMLProps } from 'react';

export default function Box(props: HTMLProps<HTMLDivElement>) {
	const { children, className, ...rest } = props;
	return (
		<div className={`box ${className ? ` ${className}` : ''}`} {...rest}>
			{children}
		</div>
	);
}
