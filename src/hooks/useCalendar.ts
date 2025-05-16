import { useState, useMemo } from 'react';

export interface CalendarDay {
	day: number;
	fullDate: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
}

export function useCalendar() {
	const [currentDate, setCurrentDate] = useState(new Date());

	const todayFullDate = useMemo(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}, []);

	const month = useMemo(
		() => currentDate.toLocaleString('default', { month: 'short' }),
		[currentDate]
	);
	const year = useMemo(() => currentDate.getFullYear(), [currentDate]);

	const daysInMonth = useMemo(
		() => new Date(year, currentDate.getMonth() + 1, 0).getDate(),
		[year, currentDate]
	);
	const firstDayOfMonth = useMemo(
		() => new Date(year, currentDate.getMonth(), 1).getDay(),
		[year, currentDate]
	);

	const weeks = useMemo(() => {
		const allCalendarDays: CalendarDay[] = [];

		const prevMonth = new Date(year, currentDate.getMonth() - 1, 1);
		const daysInPrevMonth = new Date(
			prevMonth.getFullYear(),
			prevMonth.getMonth() + 1,
			0
		).getDate();

		const numPrevMonthDaysToShow = firstDayOfMonth;

		for (let i = 0; i < numPrevMonthDaysToShow; i++) {
			const day = daysInPrevMonth - numPrevMonthDaysToShow + 1 + i;
			const fullDate = new Date(
				prevMonth.getFullYear(),
				prevMonth.getMonth(),
				day
			);
			allCalendarDays.push({
				day,
				fullDate,
				isCurrentMonth: false,
				isToday: fullDate.getTime() === todayFullDate.getTime(),
			});
		}

		for (let i = 1; i <= daysInMonth; i++) {
			const fullDate = new Date(year, currentDate.getMonth(), i);
			allCalendarDays.push({
				day: i,
				fullDate,
				isCurrentMonth: true,
				isToday: fullDate.getTime() === todayFullDate.getTime(),
			});
		}

		const nextMonth = new Date(year, currentDate.getMonth() + 1, 1);
		const totalCells = 42; // 6 weeks * 7 days
		const numNextMonthDaysToShow = totalCells - allCalendarDays.length;

		for (let i = 1; i <= numNextMonthDaysToShow; i++) {
			const fullDate = new Date(
				nextMonth.getFullYear(),
				nextMonth.getMonth(),
				i
			);
			allCalendarDays.push({
				day: i,
				fullDate,
				isCurrentMonth: false,
				isToday: fullDate.getTime() === todayFullDate.getTime(),
			});
		}

		const newWeeks: CalendarDay[][] = [];
		for (let i = 0; i < allCalendarDays.length; i += 7) {
			newWeeks.push(allCalendarDays.slice(i, i + 7));
		}
		return newWeeks;
	}, [year, currentDate, daysInMonth, firstDayOfMonth, todayFullDate]);

	const nextMonth = () => {
		setCurrentDate(
			(prevDate) =>
				new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
		);
	};
	const prevMonth = () => {
		setCurrentDate(
			(prevDate) =>
				new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
		);
	};
	const nextYear = () => {
		setCurrentDate(
			(prevDate) =>
				new Date(prevDate.getFullYear() + 1, prevDate.getMonth(), 1)
		);
	};
	const prevYear = () => {
		setCurrentDate(
			(prevDate) =>
				new Date(prevDate.getFullYear() - 1, prevDate.getMonth(), 1)
		);
	};

	const handleClickOnToday = () => {
		const now = new Date();
		setCurrentDate(
			new Date(now.getFullYear(), now.getMonth(), now.getDate())
		);
	};

	return {
		today: todayFullDate.getDate(),
		month,
		year,
		weeks,
		firstDayOfMonth,
		nextMonth,
		prevMonth,
		nextYear,
		prevYear,
		currentCalendarDate: currentDate,
		handleClickOnToday,
	};
}
