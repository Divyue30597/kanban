import styles from './section.module.scss';
import React, { forwardRef } from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
	className?: string;
	children?: React.ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>((props, ref) => {
	const { className, children, ...rest } = props;
	return (
		<section ref={ref} className={styles.section + (className ? ` ${className}` : '')} {...rest}>
			{children}
		</section>
	);
});

Section.displayName = 'Section';

export default Section;
