import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const dateExtractionOutputSlice = createSlice({
  name: 'dateExtractionOutput',
  initialState,
  reducers: {
    setDateExtractionOutput: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDateExtractionOutput } = dateExtractionOutputSlice.actions

export default dateExtractionOutputSlice.reducer