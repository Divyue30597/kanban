import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.scss';
import { SVG } from '../../SVG';

const ModalContext = createContext<{
	isOpen: boolean;
	close: () => void;
}>({
	isOpen: false,
	close: () => {},
});

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const ModalComponent = ({ isOpen, onClose, children }: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			setTimeout(() => setIsAnimating(true), 10);
		} else if (!isOpen && shouldRender) {
			setIsAnimating(false);
			const timer = setTimeout(() => setShouldRender(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen, shouldRender]);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleOutsideClick);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
			if (shouldRender) {
				document.body.style.overflow = 'hidden';
			}
		};
	}, [isOpen, onClose, shouldRender]);

	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscKey);
		}

		return () => {
			document.removeEventListener('keydown', handleEscKey);
		};
	}, [isOpen, onClose]);

	if (!shouldRender) return null;

	return ReactDOM.createPortal(
		<div
			className={`${styles.modalOverlay} ${
				isAnimating ? styles.visible : styles.hidden
			}`}
			id='modal-overlay'
		>
			<div
				className={`${styles.modalContainer} ${
					isAnimating ? styles.visible : styles.hidden
				}`}
				ref={modalRef}
			>
				<ModalContext.Provider value={{ isOpen, close: onClose }}>
					{children}
				</ModalContext.Provider>
			</div>
		</div>,
		document.body
	);
};

interface ModalHeaderProps {
	children: React.ReactNode;
	showCloseButton?: boolean;
}

const ModalHeader = ({
	children,
	showCloseButton = true,
}: ModalHeaderProps) => {
	const { close } = useContext(ModalContext);

	return (
		<div className={styles.modalHeader}>
			<div className={styles.modalTitle}>{children}</div>
			{showCloseButton && (
				<button
					className={styles.closeButton}
					onClick={close}
					aria-label="Close modal"
				>
					<SVG.cross />
				</button>
			)}
		</div>
	);
};

interface ModalBodyProps {
	children: React.ReactNode;
}

const ModalBody = ({ children }: ModalBodyProps) => (
	<div className={styles.modalBody}>{children}</div>
);

interface ModalFooterProps {
	children: React.ReactNode;
}

const ModalFooter = ({ children }: ModalFooterProps) => (
	<div className={styles.modalFooter}>{children}</div>
);

type ModalType = React.FC<ModalProps> & {
	Header: React.FC<ModalHeaderProps>;
	Body: React.FC<ModalBodyProps>;
	Footer: React.FC<ModalFooterProps>;
};

const Modal = ModalComponent as ModalType;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
