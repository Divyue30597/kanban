import { SVG } from '../../SVG';
import IconBtn from '../IconBtn';
import styles from './calendar.module.scss';

function Calendar() {
	const date = new Date();
	const today = date.getDate();
	const month = date.toLocaleString('default', { month: 'long' });
	const year = date.getFullYear();
	const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
	const firstDayOfMonth = new Date(year, date.getMonth(), 1).getDay();

	const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
	const weeks = [];
	for (let i = 0; i < days.length; i += 7) {
		if (i == 0) {
			weeks.push(days.slice(i, i + firstDayOfMonth - 1));
		} else {
			weeks.push(
				days.slice(i - firstDayOfMonth, i + 7 - firstDayOfMonth)
			);
		}
	}

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const weekDaysRow = weekDays.map((day, index) => (
		<div key={index} className={styles.weekDay}>
			{day}
		</div>
	));

	const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => (
		<div key={i} className={styles.emptyDay}></div>
	));

	const calendarRows = weeks.map((week, index) => (
		<div key={index} className={styles.weekRow}>
			{index === 0 && emptyDays}
			{week.map((day) => (
				<div key={day} className={styles.day}>
					<p className={day === today ? ` ${styles.today}` : ''}>{day}</p>
				</div>
			))}
		</div>
	));

	return (
		<div className={styles.calendar}>
			<div className={styles.calendarHeader}>
				<div className={styles.calendarButtons}>
					<IconBtn>
						<SVG.chevronLeftDouble />
					</IconBtn>
					<IconBtn>
						<SVG.chevronLeft />
					</IconBtn>
				</div>
				<h3 className={styles.calendarTitle}>
					{month} {year}
				</h3>
				<div className={styles.calendarButtons}>
					<IconBtn>
						<SVG.chevronRight />
					</IconBtn>
					<IconBtn>
						<SVG.chevronRightDouble />
					</IconBtn>
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
