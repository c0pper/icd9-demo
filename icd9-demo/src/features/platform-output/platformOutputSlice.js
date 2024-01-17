import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  value: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const platformOutputSlice = createSlice({
  name: 'platformOutput',
  initialState,
  reducers: {
    setPlatformOutput: (state, action) => {
      state.value = action.payload
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getPlatformOutput.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(getPlatformOutput.fulfilled, (state, action) => {
  //       state.status = 'succeeded';
  //       state.value = action.payload;
  //     })
  //     .addCase(getPlatformOutput.rejected, (state, action) => {
  //       state.status = 'failed';
  //       state.error = action.error.message;
  //     });
  // },
})

// Action creators are generated for each case reducer function
export const { setPlatformOutput } = platformOutputSlice.actions

export default platformOutputSlice.reducer