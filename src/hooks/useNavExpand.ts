import { useCallback, useEffect, useState } from 'react';

function useNavExpand() {
	const [expanded, setExpanded] = useState(false);

	const toggleExpand = useCallback(() => {
		setExpanded(!expanded);
	}, [expanded]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLElement &&
				(event.target.tagName === 'INPUT' ||
					event.target.tagName === 'TEXTAREA' ||
					event.target.isContentEditable)
			) {
				return;
			}

			if (event.key === ' ' || event.code === 'Space') {
				event.preventDefault();
				toggleExpand();
			}
		},
		[toggleExpand]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [expanded, handleKeyDown]);

	return {
		expanded,
		toggleExpand,
	};
}

export default useNavExpand;
