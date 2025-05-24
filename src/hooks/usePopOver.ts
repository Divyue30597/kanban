import { useState } from 'react';

function usePopOver() {
	const [onMouseOver, setOnMouseOver] = useState(false);

	const handleMouseOver = () => {
		setOnMouseOver(true);
	};

	const handleMouseLeave = () => {
		setOnMouseOver(false);
	};

	return {
		onMouseOver,
		handleMouseOver,
		handleMouseLeave,
	};
}

export default usePopOver;
