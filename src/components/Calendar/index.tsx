import { SVG } from '../../SVG';
import IconBtn from '../IconBtn';
import styles from './calendar.module.scss';
import { useCalendar, CalendarDay } from '../../hooks/useCalendar';
import Button from '../Button';
import { useState } from 'react';
import CalendarDropDown from '../CalendarDropDown';

function Calendar() {
	const {
		month,
		year,
		weeks,
		nextMonth,
		prevMonth,
		nextYear,
		prevYear,
		nextWeek,
		prevWeek,
		handleClickOnToday,
	} = useCalendar();

	const calendarModes = [
		{ id: 'month', title: 'Month' },
		{ id: 'week', title: 'Week' },
	];

	const [calendarMode, setCalendarMode] = useState(calendarModes[0]);

	const activeWeek = weeks
		.map((week) => {
			return week.filter((day) => day.isActiveWeek);
		})
		.flat();

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const weekDaysRow = weekDays.map((day, index) => (
		<div key={index} className={styles.weekDay}>
			{calendarMode.id === 'month' ? (
				<p>{day}</p>
			) : (
				<p
					className={
						activeWeek[index].isToday ? styles.activeWeekDay : ''
					}
				>
					{day} {activeWeek[index].day}
				</p>
			)}
		</div>
	));

	return (
		<div className={styles.calendar}>
			<div className={styles.calendarHeader}>
				<div className={styles.calendarHeaderBody}>
					<div>
						<Button onClick={handleClickOnToday}>Today</Button>
					</div>
					<div className={styles.calendarTitleContainer}>
						<div className={styles.calendarButtons}>
							{calendarMode.id === 'month' && (
								<IconBtn
									onClick={prevYear}
									title="Previous Year"
								>
									<SVG.chevronLeftDouble />
								</IconBtn>
							)}
							<IconBtn
								onClick={
									calendarMode.id === 'month'
										? prevMonth
										: prevWeek
								}
								title="Previous Month"
							>
								<SVG.chevronLeft />
							</IconBtn>
						</div>
						{calendarMode.id === 'month' ? (
							<h3 className={styles.calendarTitle}>
								{month} {year}
							</h3>
						) : (
							<h3 className={styles.calendarTitle}>
								Week {activeWeek[0].weekIndex + 1} of {month}
							</h3>
						)}
						<div className={styles.calendarButtons}>
							<IconBtn
								onClick={
									calendarMode.id === 'month'
										? nextMonth
										: nextWeek
								}
								title="Next Month"
							>
								<SVG.chevronRight />
							</IconBtn>
							{calendarMode.id === 'month' && (
								<IconBtn onClick={nextYear} title="Next Year">
									<SVG.chevronRightDouble />
								</IconBtn>
							)}
						</div>
					</div>
					<div>
						<CalendarDropDown
							calendarModes={calendarModes}
							calendarMode={calendarMode}
							setCalendarMode={setCalendarMode}
						/>
					</div>
				</div>
				<div className={styles.weekDays}>{weekDaysRow}</div>
			</div>

			{calendarMode.id === 'month' && <ActiveMonth weeks={weeks} />}

			{calendarMode.id === 'week' && (
				<ActiveWeek activeWeek={activeWeek} />
			)}
		</div>
	);
}

function ActiveWeek({ activeWeek }: { activeWeek: CalendarDay[] }) {
	return (
		<div className={styles.activeWeeks}>
			{activeWeek.length > 0 &&
				activeWeek.map((day) => (
					<div
						className={styles.activeWeek}
						key={day.fullDate.toISOString()}
					>
						<div>{day.fullDate.toISOString()}</div>
					</div>
				))}
		</div>
	);
}

function ActiveMonth({ weeks }: { weeks: CalendarDay[][] }) {
	return (
		<div className={styles.calendarBody}>
			<div className={styles.calendarRows}>
				{weeks.map((week: CalendarDay[], weekIndex: number) => (
					<div key={weekIndex} className={styles.weekRow}>
						{week.map((dayObject: CalendarDay) => {
							const isToday = dayObject.isToday
								? styles.today
								: '';
							const isCurrentMonth = !dayObject.isCurrentMonth
								? styles.emptyDay
								: '';

							return (
								<div
									className={
										styles.day + ' ' + isCurrentMonth
									}
									key={dayObject.fullDate.toISOString()}
								>
									<p className={isToday}>{dayObject.day}</p>
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}

export default Calendar;
