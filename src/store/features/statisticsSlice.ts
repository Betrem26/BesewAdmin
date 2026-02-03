import { createSlice } from "@reduxjs/toolkit";

const statisticsSlice = createSlice({
    name: "statistics",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        setStatistics: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setStatistics } = statisticsSlice.actions;
export default statisticsSlice.reducer;
