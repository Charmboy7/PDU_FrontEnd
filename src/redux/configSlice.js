import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  data: {},
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.step < 3) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },
    updateData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

export const { nextStep, prevStep, updateData } = configSlice.actions;
export default configSlice.reducer;
