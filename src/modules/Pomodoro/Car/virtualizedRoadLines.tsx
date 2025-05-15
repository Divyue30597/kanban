import { memo, useMemo, useEffect, useRef } from 'react';

interface VirtualizedRoadLinesProps {
	progress?: number; // 0-100 percent
	timer?: number; // total time in minutes
	animationSpeed?: number; // speed control factor (lower = slower)
}

const VirtualizedRoadLines = memo(function VirtualizedRoadLines({
	progress = 0,
	timer = 25,
	animationSpeed = 1,
}: VirtualizedRoadLinesProps) {
	const totalSeconds = timer * 60;
	const roadRef = useRef<HTMLDivElement>(null);
	const lastOffsetRef = useRef<number>(0);

	const lineWidth = 4 * 16;
	const lineMargin = 12 * 16;
	const lineTotal = lineWidth + lineMargin;

	const elapsedSeconds = useMemo(
		() => (progress / 100) * totalSeconds * animationSpeed,
		[progress, totalSeconds, animationSpeed]
	);

	useEffect(() => {
		if (!roadRef.current) return;

		let patternOffset: number;

		if (animationSpeed > 0) {
			patternOffset = elapsedSeconds * lineTotal;
			lastOffsetRef.current = patternOffset; // Save current offset
		} else {
			patternOffset = lastOffsetRef.current;
		}

		requestAnimationFrame(() => {
			if (roadRef.current) {
				roadRef.current.style.setProperty(
					'--pattern-offset',
					`-${patternOffset}px`
				);
			}
		});
	}, [elapsedSeconds, lineTotal, animationSpeed]);

	return (
		<div
			style={{
				position: 'absolute',
				width: '100%',
				top: 'calc(100% / 2.5)',
				left: 0,
				overflow: 'hidden',
				pointerEvents: 'none',
			}}
		>
			<div
				ref={roadRef}
				style={{
					width: '100%',
					height: '0.4rem',
					backgroundImage: `repeating-linear-gradient(
						to right,
						#fff 0,
						#fff ${lineWidth / 16}rem,
						transparent ${lineWidth / 16}rem,
						transparent ${(lineWidth + lineMargin) / 16}rem
						)`,
					backgroundPosition: `var(--pattern-offset, 0px) 0`,
					backgroundSize: `${(lineWidth + lineMargin) / 16}rem 0.4rem`,
					transition: 'background-position 50ms linear',
					willChange: 'background-position',
					pointerEvents: 'none',
					transform: 'translateZ(0)',
				}}
			/>
		</div>
	);
});

export default VirtualizedRoadLines;
