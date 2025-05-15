import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const generateTheme = createAsyncThunk(
	'themeGenerator/generateTheme',
	async (prompt: string, { rejectWithValue }) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/generate-theme`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ prompt }),
				}
			);
			if (!response.ok) throw new Error('Failed to generate theme');
			return await response.json();
		} catch (err: Error | unknown | any) {
			if (err instanceof Error) {
				return rejectWithValue(err.message);
			}
			return rejectWithValue(err.message);
		}
	}
);

const themeGeneratorSlice = createSlice({
	name: 'themeGenerator',
	initialState: {
		loading: false,
		error: null as string | null,
		data: null as any,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(generateTheme.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.data = null;
			})
			.addCase(generateTheme.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(generateTheme.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export default themeGeneratorSlice.reducer;
