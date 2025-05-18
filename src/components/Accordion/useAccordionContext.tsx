import { createContext, useContext } from 'react';

interface IAccordionContext {
	isOpen: boolean | null;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
	handleOpen: () => void;
}

export const AccordionContext = createContext<IAccordionContext | null>(null);

export default function useAccordionContext() {
	const context = useContext(AccordionContext);

	if (!context) {
		throw new Error('useAccordionContext must be used within an AccordionProvider');
	}

	return context;
}
