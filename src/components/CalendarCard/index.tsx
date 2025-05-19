import styles from './calendarCard.module.scss';
import { getTagColors } from '../../utils/utils';

interface CalendarCardProps extends React.HTMLAttributes<HTMLDivElement> {}

function CalendarCard(props: CalendarCardProps) {
	const { className, ...rest } = props;

	const { backgroundColor, color } = getTagColors('');
	return (
		<div
			className={`${styles.card} ${className}`}
			style={{ backgroundColor, borderLeft: `0.2rem solid ${color}`, color: color }}
			{...rest}
		>
			Calendar Card
		</div>
	);
}

export default CalendarCard;
