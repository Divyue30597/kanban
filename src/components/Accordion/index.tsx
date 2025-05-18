'use client';
import React, { useState } from 'react';
import styles from './accordion.module.scss';
import useAccordionContext, { AccordionContext } from './useAccordionContext';

function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
	const [isOpen, setIsOpen] = useState<boolean | null>(null);

	const handleOpen = () => setIsOpen(!isOpen);

	return (
		<AccordionContext.Provider value={{ isOpen, setIsOpen, handleOpen }}>
			<div className={styles.accordion + ' ' + (className || '')}>{children}</div>
		</AccordionContext.Provider>
	);
}

function Header({ headingText }: { headingText: string }) {
	const { isOpen, handleOpen } = useAccordionContext();

	return (
		<div className={`${styles.accordion_heading}  ${isOpen ? styles.open : ''}`} onClick={handleOpen}>
			<h3>{headingText}</h3>
		</div>
	);
}

function Body({ children }: { children: React.ReactNode }) {
	const bodyConsumer = useAccordionContext();

	return <div className={styles.accordion_body + ` ${bodyConsumer?.isOpen ? styles.open : ''}`}>{children}</div>;
}

Accordion.Header = Header;
Accordion.Body = Body;

export default Accordion;
