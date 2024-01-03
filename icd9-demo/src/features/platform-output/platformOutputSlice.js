import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const platformOutputSlice = createSlice({
  name: 'platformOutput',
  initialState,
  reducers: {
    setPlatformOutput: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPlatformOutput } = platformOutputSlice.actions

export default platformOutputSlice.reducer