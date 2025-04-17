import { createSlice } from '@reduxjs/toolkit';

type TimeLeft = {
	pomodoro: number;
	shortBreak: number;
	longBreak: number;
};

type IsRunning = {
	pomodoro: boolean;
	shortBreak: boolean;
	longBreak: boolean;
};

type ActiveTabType = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroState {
	timeLeft: TimeLeft;
	isRunning: IsRunning;
	activeTab: ActiveTabType;
	initialTimes: TimeLeft;
}

const initialTimes: TimeLeft = {
	pomodoro: 25 * 60,
	shortBreak: 5 * 60,
	longBreak: 15 * 60,
};

const initialState: PomodoroState = {
	timeLeft: initialTimes,
	isRunning: {
		pomodoro: false,
		shortBreak: false,
		longBreak: false,
	},
	activeTab: 'pomodoro',
	initialTimes: initialTimes,
};

const pomodoroSlice = createSlice({
	name: 'pomodoro',
	initialState,
	reducers: {},
});
