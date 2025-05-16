import { SVG } from '../../SVG';
import IconBtn from '../IconBtn';
import styles from './calendar.module.scss';
import { useCalendar, CalendarDay } from '../../hooks/useCalendar';
import Button from '../Button';

function Calendar() {
	const {
		month,
		year,
		weeks,
		nextMonth,
		prevMonth,
		nextYear,
		prevYear,
		handleClickOnToday,
	} = useCalendar();

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const weekDaysRow = weekDays.map((day, index) => (
		<div key={index} className={styles.weekDay}>
			{day}
		</div>
	));

	const calendarRows = weeks.map((week: CalendarDay[], weekIndex: number) => (
		<div key={weekIndex} className={styles.weekRow}>
			{week.map((dayObject: CalendarDay) => {
				const isToday = dayObject.isToday ? styles.today : '';
				const isCurrentMonth = !dayObject.isCurrentMonth
					? styles.emptyDay
					: '';

				return (
					<div
						className={styles.day + ' ' + isCurrentMonth}
						key={dayObject.fullDate.toISOString()}
					>
						<p className={isToday}>{dayObject.day}</p>
					</div>
				);
			})}
		</div>
	));

	return (
		<div className={styles.calendar}>
			<div className={styles.calendarHeader}>
				<div>
					<Button onClick={handleClickOnToday}>Today</Button>
				</div>
				<div className={styles.calendarTitleContainer}>
					<div className={styles.calendarButtons}>
						<IconBtn onClick={prevYear} title="Previous Year">
							<SVG.chevronLeftDouble />
						</IconBtn>
						<IconBtn onClick={prevMonth} title="Previous Month">
							<SVG.chevronLeft />
						</IconBtn>
					</div>
					<h3 className={styles.calendarTitle}>
						{month} {year}
					</h3>
					<div className={styles.calendarButtons}>
						<IconBtn onClick={nextMonth} title="Next Month">
							<SVG.chevronRight />
						</IconBtn>
						<IconBtn onClick={nextYear} title="Next Year">
							<SVG.chevronRightDouble />
						</IconBtn>
					</div>
				</div>
				<div>
					<Button onClick={handleClickOnToday}>Create Event</Button>
				</div>
			</div>
			<div className={styles.calendarBody}>
				<div className={styles.weekDays}>{weekDaysRow}</div>
				<div className={styles.calendarRows}>{calendarRows}</div>
			</div>
		</div>
	);
}

export default Calendar;
