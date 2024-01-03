import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const processedPlatformOutputSlice = createSlice({
  name: 'processedPlatformOutput',
  initialState,
  reducers: {
    setProcessedPlatformOutput: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setProcessedPlatformOutput } = processedPlatformOutputSlice.actions

export default processedPlatformOutputSlice.reducer