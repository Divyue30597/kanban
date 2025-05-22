import styles from './calendarCard.module.scss';
import { getTagColors } from '../../utils/utils';

interface CalendarCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const CalendarCard = (props: CalendarCardProps) => {
	const { children, className, ...rest } = props;

	const { backgroundColor, color } = getTagColors('');
	return (
		<div
			className={`${styles.card} ${className ?? ''}`}
			style={{
				backgroundColor,
				borderLeft: `0.2rem solid ${color}`,
				color,
			}}
			{...rest}
		>
			{children}
		</div>
	);
};

CalendarCard.Month = function CalendarCardMonth(props: CalendarCardProps) {
	const { children, className, ...rest } = props;
	return (
		<CalendarCard className={className} {...rest}>
			{children || 'Calendar Card Month'}
		</CalendarCard>
	);
};

CalendarCard.Week = function CalendarCardWeek(props: CalendarCardProps) {
	return <CalendarCard {...props}>{props.children || 'Calendar Card Week'}</CalendarCard>;
};

export default CalendarCard;
