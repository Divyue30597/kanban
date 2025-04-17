import React, { useState, useRef, useEffect } from 'react';
import styles from './dropdown.module.scss';

interface DropdownProps {
	trigger: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	dropdownClassName?: string;
	placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
	closeOnItemClick?: boolean;
	closeOnOutsideClick?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
	trigger,
	children,
	className = '',
	dropdownClassName = '',
	placement = 'bottom-left',
	closeOnItemClick = true,
	closeOnOutsideClick = true,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!closeOnOutsideClick) return;

		const handleOutsideClick = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				triggerRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!triggerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleOutsideClick);
		}

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen, closeOnOutsideClick]);

	const enhancedChildren = closeOnItemClick
		? React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, {
						...(child.props as any),
						onClick: (e: React.MouseEvent<HTMLElement>) => {
							if (child.props.onClick) {
								child.props.onClick(e);
							}
							setIsOpen(false);
						},
					});
				}
				return child;
			})
		: children;

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<div className={`${styles.dropdownWrapper} ${className}`}>
			<div
				ref={triggerRef}
				className={styles.trigger}
				onClick={toggleDropdown}
			>
				{trigger}
			</div>

			{isOpen && (
				<div
					ref={dropdownRef}
					className={`
            ${styles.dropdown} 
            ${styles[placement]} 
            ${dropdownClassName}
          `}
				>
					{enhancedChildren}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
