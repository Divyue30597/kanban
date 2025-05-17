import { useState, useMemo } from 'react';

export interface CalendarDay {
	day: number;
	fullDate: Date;
	isCurrentMonth: boolean;
	isActiveWeek: boolean;
	weekIndex: number;
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
				isActiveWeek: false, // Initialize to false
				weekIndex: Math.floor(i / 7),
				isToday: fullDate.getTime() === todayFullDate.getTime(),
			});
		}

		for (let i = 1; i <= daysInMonth; i++) {
			const fullDate = new Date(year, currentDate.getMonth(), i);
			allCalendarDays.push({
				day: i,
				fullDate,
				isCurrentMonth: true,
				isActiveWeek: false, // Initialize to false
				weekIndex: Math.floor((i + firstDayOfMonth) / 7),
				isToday: fullDate.getTime() === todayFullDate.getTime(),
			});
		}

		const nextMonthDate = new Date(year, currentDate.getMonth() + 1, 1); // Renamed to avoid conflict
		const totalCells = 42; // 6 weeks * 7 days
		const numNextMonthDaysToShow = totalCells - allCalendarDays.length;

		for (let i = 1; i <= numNextMonthDaysToShow; i++) {
			const fullDate = new Date(
				nextMonthDate.getFullYear(),
				nextMonthDate.getMonth(),
				i
			);
			allCalendarDays.push({
				day: i,
				fullDate,
				isCurrentMonth: false,
				isActiveWeek: false, // Initialize to false
				weekIndex: Math.floor(
					(allCalendarDays.length + firstDayOfMonth) / 7
				),
				isToday: fullDate.getTime() === todayFullDate.getTime(),
			});
		}

		// Determine the active week
		const currentDayInFocus = new Date(currentDate);
		currentDayInFocus.setHours(0, 0, 0, 0); // Normalize current date

		const startOfWeek = new Date(currentDayInFocus);
		startOfWeek.setDate(
			currentDayInFocus.getDate() - currentDayInFocus.getDay()
		);

		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);

		allCalendarDays.forEach((dayObj) => {
			const dayObjFullDate = new Date(dayObj.fullDate);
			dayObjFullDate.setHours(0, 0, 0, 0); // Normalize for comparison
			if (
				dayObjFullDate.getTime() >= startOfWeek.getTime() &&
				dayObjFullDate.getTime() <= endOfWeek.getTime()
			) {
				dayObj.isActiveWeek = true;
			}
		});

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

	const nextWeek = () => {
		setCurrentDate((prevDate) => {
			const newDate = new Date(prevDate);
			newDate.setDate(newDate.getDate() + 7);
			return newDate;
		});
	};

	const prevWeek = () => {
		setCurrentDate((prevDate) => {
			const newDate = new Date(prevDate);
			newDate.setDate(newDate.getDate() - 7);
			return newDate;
		});
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
		nextWeek,
		prevWeek,
		currentCalendarDate: currentDate,
		handleClickOnToday,
	};
}
